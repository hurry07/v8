//
//  TestGc.cpp
//  v8
//
//  Created by jie on 13-9-10.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "TestGc.h"
#include <v8.h>
#include "classes/file.h"
#include "classes/gcobserver.h"
#include "core/ClassWrap.h"

//using namespace v8;
//
//Isolate* node_isolate = NULL;
//
//static v8::Handle<v8::Script> ReadFile(const char* name) {
//    HandleScope scope;
//    
//	JSFile* file = JSFile::loadAsset(name);
//    if(file->isEmpty()) {
//        delete file;
//        return scope.Close(Script::Compile(String::New("")));
//    }
//    
//	v8::Handle<v8::String> result = v8::String::New(file->chars(), file->size());
//    delete file;
//	return scope.Close(Script::Compile(result));
//}
//
//static void printf__(const FunctionCallbackInfo<Value>& args) {
//	std::string buf;
//	int length = args.Length();
//	if (length == 0) {
//		return;
//	}
//	buf.append(*String::Utf8Value(args[0]->ToString()));
//	for (int i = 1; i < length; i++) {
//		buf.append(",");
//		buf.append(*String::Utf8Value(args[i]->ToString()));
//	}
//	LOGI("%s", buf.c_str());
//}
//
//static void unrefCallback(Isolate* isolate, Persistent<Object>* value, GcObserver* parameter) {
//    LOGI("release persistent");
//}

void testGc() {
//    LOGI("testGc");
//    node_isolate = Isolate::New();
//    node_isolate->Enter();
//    
//    Persistent<Context> context_p;
//    
//    {
//        HandleScope scope(node_isolate);
//        context_p.Reset(node_isolate, Context::New(node_isolate));
//    }
//    
//    {
//        HandleScope scope(node_isolate);
//        Local<Context> context = Local<Context>::New(node_isolate, context_p);
//        context->Enter();
//        
//        Handle<v8::Script> script = ReadFile("testgc.js");
//        Local<Value> f_value = script->Run();
//        Local<Function> f = Local<Function>::Cast(f_value);
//        
//        Handle<v8::Object> global = context->Global();
//        global->Set(String::New("print"), FunctionTemplate::New(printf__)->GetFunction());
//        ClassWrap<GcObserver>::expose(global);
//        Handle<Value> arg[0];
//        f->Call(context->Global(), 0, arg);
//        
//        Handle<Value> argv;
//        Local<Function> force = Local<Function>::Cast(global->Get(String::New("forceGc")));
//        
//        Persistent<Object> process_p;
//        process_p.Reset(node_isolate, global->Get(String::New("gc2"))->ToObject());
//        while (!v8::V8::IdleNotification());
//        
//        Local<Function> fn = Local<Function>::Cast(global->Get(String::New("testFn")));
//        fn->Call(global, 0, &argv);
//        while (!v8::V8::IdleNotification());
//        
//        fn = Local<Function>::Cast(global->Get(String::New("removeRef")));
//        fn->Call(global, 0, &argv);
//        while (!v8::V8::IdleNotification());
//        
//        force->Call(global, 0, &argv);
//        while (!v8::V8::IdleNotification());
//        
//        process_p.Dispose();
//        process_p.Clear();
//        
//        context->Exit();
//
//        {
//            HandleScope scope(node_isolate);
//            Local<Context> context = Local<Context>::New(node_isolate, context_p);
//            context->Enter();
//            
//            Handle<v8::Object> global = context->Global();
//            
//            Handle<Value> argv;
//            Local<Function> force = Local<Function>::Cast(global->Get(String::New("forceGc")));
//            
//            LOGI("handleScope 02");
//            force->Call(global, 0, &argv);
//            while (!v8::V8::IdleNotification());
//            
//            context->Exit();
//        }
//    }
//
//    {
//        HandleScope scope(node_isolate);
//        Local<Context> context = Local<Context>::New(node_isolate, context_p);
//        context->Enter();
//        
//        Handle<v8::Object> global = context->Global();
//        
//        Handle<Value> argv;
//        Local<Function> force = Local<Function>::Cast(global->Get(String::New("forceGc")));
//        
//        LOGI("handleScope 02");
//        force->Call(global, 0, &argv);
//        while (!v8::V8::IdleNotification());
//        
//        context->Exit();
//    }
}