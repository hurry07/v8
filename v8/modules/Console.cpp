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

namespace node {
    static void log(const FunctionCallbackInfo<Value>& args) {
        std::string buf;
        int length = args.Length();
        if(length == 0) {
            return;
        }
        buf.append(*String::Utf8Value(args[0]->ToString()));
        for (int i = 1; i < length; i++) {
            buf.append(",");
            buf.append(*String::Utf8Value(args[i]->ToString()));
        }
        buf.append("\n");
        LOGI(buf.c_str());
    }

    static void init(const FunctionCallbackInfo<Value>& args) {
        HandleScope scope;
        Local<Object> target = args[0]->ToObject();

        NODE_SET_METHOD(target, "log", log);
    }

    NODE_MODULE(Console, "node_console", init);
}
