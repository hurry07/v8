//
//  Console.cpp
//  v8
//
//  Created by jie on 13-8-4.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "Console.h"
#include "../global.h"

using namespace v8;
static void test(const v8::FunctionCallbackInfo<Value>& args) {
    global::testValue(args[0]);
    LOGI("%f, %d", args[0]->NumberValue(), args[0]->Int32Value());
}
static void appendContent(const v8::FunctionCallbackInfo<Value>& args, std::string& buf) {
    int length = args.Length();
    if(length == 0) {
        return;
    }
    buf.append(*String::Utf8Value(args[0]->ToString()));
    for (int i = 1; i < length; i++) {
        buf.append(",");
        buf.append(*String::Utf8Value(args[i]->ToString()));
    }
}
static void console_log(const v8::FunctionCallbackInfo<Value>& args) {
    std::string buf;
    appendContent(args, buf);
    LOGI("%s", buf.c_str());
}
static void console_error(const v8::FunctionCallbackInfo<Value>& args) {
    std::string buf;
    appendContent(args, buf);
    LOGE("%s", buf.c_str());
}

template<> void Module<Console>::init(const v8::FunctionCallbackInfo<Value>& args) {
    HandleScope scope;
    Local<Object> target = args[0]->ToObject();
    
    NODE_SET_METHOD(target, "log", console_log);
    NODE_SET_METHOD(target, "error", console_error);
    NODE_SET_METHOD(target, "test", test);
}

template<> const char* Module<Console>::mFile = __FILE__;
template<> const char* Module<Console>::mName = "node_console";
