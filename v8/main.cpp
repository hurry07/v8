//
//  main.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//


#include <string>

#include "Point.h"
#include <iostream>
#include <v8.h>
#include "app/Application.h"
#include "utils/AssetUtil.h"

using namespace v8;

std::string dir(std::string path, std::string subpath) {
    std::string::size_type index = path.find_last_of('/');
    if (index != std::string::npos){
        printf("path:%s", path.substr(0, index).c_str());
        return path.substr(0, index).append(subpath);
    } else {
        return subpath;
    }
}
std::string source_root = dir(__FILE__, "/assets/").c_str();

//class ArrayBufferAllocator : public v8::ArrayBuffer::Allocator {
//public:
//    // Impose an upper limit to avoid out of memory errors that bring down
//    // the process.
//    static const size_t kMaxLength = 0x3fffffff;
//    static ArrayBufferAllocator the_singleton;
//    virtual ~ArrayBufferAllocator() {}
//    virtual void* Allocate(size_t length);
//    virtual void Free(void* data);
//private:
//    ArrayBufferAllocator() {}
//    ArrayBufferAllocator(const ArrayBufferAllocator&);
//    void operator=(const ArrayBufferAllocator&);
//};
//
//ArrayBufferAllocator ArrayBufferAllocator::the_singleton;

//Isolate* node_isolate = NULL;

//void log(const FunctionCallbackInfo<Value>& args) {
//    HandleScope scope(node_isolate);
//    if(args.Length() > 0) {
//        printf("log:%s\n", *String::AsciiValue(args[0]->ToString()));
//    }
//    //    args.GetReturnValue().Set(err);
//}
//
//void runTest() {
//    Locker locker(node_isolate);
//    HandleScope handle_scope(node_isolate);
//
//    // Create the one and only Context.
//    Local<Context> context = Context::New(node_isolate);
//    Context::Scope context_scope(context);
//    context->Global()->Set(String::New("log"), FunctionTemplate::New(log)->GetFunction());
//
//    Local<String> source = String::New(
//                                       "var c = {name:'aaa'};c.__proto__=this;"
//                                       "function test1() {"
//                                       "    this.log();"
//                                       "    log();"
//                                       "    this.name = 'jack';"
//                                       "};"
//                                       "test1.call(c);"
//                                       );
//    Local<Script> script = Script::Compile(source);
//    script->Run();
//
//    Local<Value> name = context->Global()->Get(String::New("name"));
//    printf("get %s\n", *String::AsciiValue(name->ToString()));
//}
//
//void testGlobal() {
//    Locker locker(node_isolate);
//    HandleScope handle_scope(node_isolate);
//
//    // Create the one and only Context.
//    Local<Context> context = Context::New(node_isolate);
//    Context::Scope context_scope(context);
//    context->Global()->Set(String::New("log"), FunctionTemplate::New(log)->GetFunction());
//
//    Local<String> source = String::New(
//                                       "function a(ex) {"
//                                       "    ex.connection = function() {"
//                                       "    };"
//                                       "    function test1() {"
//                                       "    };"
//                                       "};"
//                                       "var ex = {};a(ex);"
//                                       "function test2() {"
//                                       "    log('a');"
//                                       "}"
//                                       );
//
//    Local<Script> script = Script::Compile(source);
//    script->Run();
//
//    Local<Object> name = context->Global()->Get(String::New("ex"))->ToObject();
//    printf("get %s\n", *String::AsciiValue(name->ToString()));
//
//    Local<Object> test2 = context->Global()->Get(String::New("test2"))->ToObject();
//    Handle<v8::Function> func = v8::Handle<v8::Function>::Cast(test2);
//    Handle<Value> args[2];
//    args[0] = v8::String::New("value1");
//    args[1] = v8::String::New("value2");
//    func->Call(context->Global(), 2, args);
//    func->Call(String::New("a?")->ToObject(), 2, args);
//}

Persistent<Context> context_p;
void prepare() {
    node_isolate = Isolate::New();
    node_isolate->Enter();
    
    HandleScope scope;
    context_p.Reset(node_isolate, Context::New(node_isolate));
}
void teardown() {
    context_p.Dispose();
    node_isolate->Exit();
    node_isolate->Dispose();
}
Local<Context> GetV8Context() {
	return Local<Context>::New(node_isolate, context_p);
}
Handle<Value> eval(const char* script) {
    HandleScope scope(node_isolate);
    Local<Context> context = GetV8Context();
    Context::Scope context_scope(context);
    
	v8::Handle<v8::String> source = String::New(script);
	Local<Script> comp = Script::Compile(source);
	return scope.Close(comp->Run());
}
void getX(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    
}
int main(int argc, const char * argv[])
{
    //    printf("\ninit path:%s", source_root.c_str());
    //    Application* app = new Application();
    //    app->init();
    //    app->onDrawFrame();
    //    app->onDrawFrame();
    //    app->destroy();
    //    app->onDrawFrame();
    //    app->onDrawFrame();
    //    delete app;
    prepare();
    
    {
        HandleScope scope(node_isolate);
        Local<Context> context = GetV8Context();
        Context::Scope context_scope(context);
        
        Handle<FunctionTemplate> fn = FunctionTemplate::New();
        fn->SetClassName(String::New("P"));
        context->Global()->Set(String::New("P"), fn->GetFunction());
        
        Local<ObjectTemplate> fnproto = fn->PrototypeTemplate();
        fnproto->SetAccessor(String::New("test"), getX);
        Local<ObjectTemplate> fninst = fn->InstanceTemplate();
        
        eval("new P()");
    }
    
    teardown();
    return 0;
}
