//
//  Yell.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "Yell.h"
#include "include/v8.h"

using namespace v8;

Handle<Value> Yell(const Arguments& args) {
	HandleScope  handle_scope;
	char buffer[4096];
	
	memset(buffer, 0, sizeof(buffer));
	Handle<String> str = args[0]->ToString();
	str->WriteAscii(buffer);
	printf("Yell: %s\n", buffer);
    
	return Undefined();
}

int main11(int argc, char** argv) {
//	HandleScope handle_scope;
//    
	//A
	Handle<FunctionTemplate> fun = v8::FunctionTemplate::New(Yell);
//    Local<ObjectTemplate> fins = fun->InstanceTemplate();
    
	//B
	Handle<ObjectTemplate> global = ObjectTemplate::New();
	global->Set(String::New("yell"), fun);

	//C
//	Persistent<Context> cxt;

    // Create a stack-allocated handle scope.
    HandleScope handle_scope;
    // Create a new context.
    Local<Context> context = v8::Context::New(Isolate::GetCurrent());
    Persistent<Context> persistent_context(Isolate::GetCurrent(), context);
    // Enter the created context for compiling and
    // running the hello world script.
    Context::Scope context_scope(context);

	//Context::Scope context_scope(cxt);
	Handle<String> source = String::New("yell('Google V8!')");
	Handle<Script> script = Script::Compile(source);
	Handle<Value> result = script->Run();
    
//	context.Dispose();
}
