//
//  Application.cpp
//  v8
//
//  Created by jie on 13-8-4.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "Application.h"
#include "../core/ClassWrap.h"
#include "../core/Module.h"
#include "../core/v8Utils.h"
#include "../classes/classes.h"
#include "node.h"
#include "../modules/modules.h"
#include "../modules/CCImage.h"
#include "../utils/AssetUtil.h"
#include "../global.h"

#include <string>
#include <OpenGL/gl.h>

using namespace node;
bool Application::debug = false;

Isolate* node_isolate = NULL;

#define ENTER_ISOLATE \
Locker locker(node_isolate);\
Isolate::Scope iso_scope(node_isolate)

#define EXIT_ISOLATE v8::Unlocker unlocker(node_isolate)
#define HANDLE_SCOPE HandleScope scope(node_isolate)

#define CONTEXT_SCOPE \
Local<Context> context = GetV8Context();\
Context::Scope context_scope(context)

#define SAFE_DELETE(p) if(p!=NULL){delete p;}
#define SAFE_DISPOSE(p) p.Dispose()

Application::Application() {
	node_isolate = Isolate::New();
	ENTER_ISOLATE;

	game = 0;
	render = 0;

	HANDLE_SCOPE;
	context_p.Reset(node_isolate, Context::New(node_isolate));
}
Application::~Application() {
	{
		ENTER_ISOLATE;

		SAFE_DISPOSE(process_p);
		SAFE_DISPOSE(context_p);

		SAFE_DELETE(render);
		SAFE_DELETE(game);
	}
	node_isolate->Dispose();
}
Local<Context> Application::GetV8Context() {
	return Local<Context>::New(node_isolate, context_p);
}

v8::Handle<v8::String> ReadFile(const char* name) {
	HANDLE_SCOPE;

	AssetFile* file = AssetUtil::load(name);
	v8::Handle<v8::String> result = v8::String::New(file->chars(), file->size());
	file->release();
	return scope.Close(result);
}

static void printf__(const FunctionCallbackInfo<Value>& args) {
	std::string buf;
	int length = args.Length();
	if (length == 0) {
		return;
	}
	buf.append(*String::Utf8Value(args[0]->ToString()));
	for (int i = 1; i < length; i++) {
		buf.append(",");
		buf.append(*String::Utf8Value(args[i]->ToString()));
	}
	LOGI(buf.c_str());
}

Local<Function> Application::loadModuleFn(const char* name) {
	HANDLE_SCOPE;

	AssetFile* file = AssetUtil::load(name);
	if (file == 0) {
		printf("error, file not found:%s\n", name);
	}
	std::string sc("(function (exports, require, module, __filename) {\n");
	if (file != 0) {
		sc.append(file->chars());
	}
	sc.append("\n});");
	if (file != 0) {
		file->release();
	}

	v8::Handle<v8::String> source = String::New(sc.c_str());
	Local<Script> comp = Script::Compile(source);

	return scope.Close(Local<Function>::Cast(comp->Run()));
}

void Application::Binding(const FunctionCallbackInfo<Value>& args) {
	HANDLE_SCOPE;

	Local<String> module = args[0]->ToString();
	String::Utf8Value module_v(module);
	node::node_module_struct* modp;

	Handle<Function> func;

	// buildin_module 就是用 c++ 实现的 module
	if ((modp = get_builtin_module(*module_v)) != NULL) { // c++ 实现的模块
		func = FunctionTemplate::New(modp->register_func)->GetFunction();
	} else {
		func = loadModuleFn(*module_v);
	}

	args.GetReturnValue().Set(func);
}
Local<Script> Application::loadScript(const char* path) {
	HANDLE_SCOPE;

	v8::Handle<v8::String> source = ReadFile(path);
	return scope.Close(Script::Compile(source));
}

Handle<Object> Application::SetupProcessObject() {
	HANDLE_SCOPE;

	Local<FunctionTemplate> t = FunctionTemplate::New();
	t->SetClassName(String::New("process"));

	NODE_SET_PROTOTYPE_METHOD(t, "binding", Binding);

	Local<Object> process = t->GetFunction()->NewInstance();
	return scope.Close(process);
}

void testImageLoad(std::string filename) {
//	AssetFile* file = AssetUtil::load(filename.c_str());
//	CCImage::EImageFormat type = node::CCImage::getType(filename);
//	node::CCImage* image = new node::CCImage();
//	image->initWithImageData(file->chars(), file->size(), type);
//	LOGI("read picture name:%s length:%d width:%d height:%d", filename.c_str(), file->size(), image->getWidth(), image->getHeight());
//	file->release();
//	delete image;
}

void Application::init() {
	testImageLoad("battle/battle_bg_small.jpg");
	testImageLoad("battle/battlearea_bg.png");

	{
		ENTER_ISOLATE;
		HANDLE_SCOPE;
		CONTEXT_SCOPE;

        // binding test func
		context->Global()->Set(String::New("print"), FunctionTemplate::New(printf__)->GetFunction());

		Handle<Object> process = SetupProcessObject();
		process_p.Reset(node_isolate, process);

		// init with node.js
		Local<Script> initscript = loadScript("node.js");
		Local<Value> f_value = initscript->Run();
		Local<Function> f = Local<Function>::Cast(f_value);

		// init global
		Handle<Value> arg = process;
		f->Call(context->Global(), 1, &arg);

		// load game module
		Handle<Value> gameExports = eval("require('game.js')");
		game = new JSObject(gameExports->ToObject());
		render = new JSObject(game->getAttribute<Object>("render"));
        
        ClassWrap<Point>::expose(context->Global());
        ClassWrap<Matrix>::expose(context->Global());
        eval(
             "var m1 = new matrix();"
             "m1.rotate();"
             "m1.translate();"
             "var m2 = new matrix();"
             "console.log(m1 === m2);"
             "console.log(m1.prototype === m2.prototype);"
             );

        glm::mat4(1.0);
//        Handle<Object> ins = ClassWrap<Point>::newInstance();
//        Point* p = selfPtr<Point>(ins);
//        p->init(100, 150);
//
//        LOGI("internal is number:%s %s", ClassBase<Point>::mName, Point::mName);
//        LOGI("point types:%d %d", ClassBase<Point>::mClassType, Point::mClassType);
//
//        Handle<Object> p = ClassWrap<Point>::newInstance();
//        LOGI("point types:%d %d", ClassBase<Point>::mClassType, Point::mClassType);
//        Handle<Value> key = p->GetInternalField(1);
//        if(key->IsInt32()) {
//            LOGI("internal is number:%d %d %d", key->Int32Value(), ClassType::CLASS_POINT, Point::mClassType);
//        }
//        LOGI("p.internalcount:%d", p->InternalFieldCount());
        
        Handle<Object> ins = ClassWrap<Point>::newInstance();
        
        NEW_INSTANCE(pwrap, Point, 102, 200);
	}
}
void Application::destroy() {
	{
		ENTER_ISOLATE;
		EXIT_ISOLATE;
	}

	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;
	while (!v8::V8::IdleNotification());
}
void Application::pause() {
	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;
	game->callFunction("pause");
}
void Application::resume() {
	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;
	game->callFunction("resume");
}
void Application::gc() {
	HANDLE_SCOPE;
	CONTEXT_SCOPE;

	while (!v8::V8::IdleNotification());
}
void Application::evalScript(const char* sprite) {
	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;

    v8::Handle<v8::String> source = String::New(sprite);
	Local<Script> comp = Script::Compile(source);
    Local<Value> result = comp->Run();

	LOGI(*String::Utf8Value(result->ToString()));
}
Handle<Value> Application::eval(const char* script) {
	HANDLE_SCOPE;
	CONTEXT_SCOPE;

	v8::Handle<v8::String> source = String::New(script);
	Local<Script> comp = Script::Compile(source);
	return scope.Close(comp->Run());
}
void Application::onSurfaceCreated() {
	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;
	render->callFunction("onSurfaceCreated");
	glViewport(0, 0, 100, 100);
	glClearColor(1, 1, 0, 1);
}
void Application::onSurfaceChanged(float width, float height) {
	ENTER_ISOLATE;
	HANDLE_SCOPE;
	CONTEXT_SCOPE;

	Handle<Value> args[2];
	args[0] = Number::New(width);
	args[1] = Number::New(height);
	render->callFunction("onSurfaceChanged");
}
void Application::onDrawFrame() {
//	ENTER_ISOLATE;
//	HANDLE_SCOPE;
//	CONTEXT_SCOPE;
//	static const char* name = "onDrawFrame";
//	render->callFunction(name);
//	glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
}
