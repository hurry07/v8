//
//  Application.h
//  v8
//
//  Created by jie on 13-8-4.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Application__
#define __v8__Application__

#include <iostream>
#include <v8.h>
#include "node.h"
#include "../core/JSObject.h"

using namespace v8;

class Application {
public:
    Persistent<Object> process_p;
    Persistent<Context> context_p;

    Application();
    ~Application();

    void init();
    void pause();
    void resume();
    void destroy();
    void gc();

    void onSurfaceCreated(float width, float height);
    void onSurfaceChanged(float width, float height);
    void onDrawFrame();
    void evalScript(const char* sprite);

    static char* source_root;
    static bool debug;

private:
    /**
     * 加载一个 function
     */
    static void Binding(const FunctionCallbackInfo<Value>& args);
    static Local<Function> loadModuleFn(const char* name);

    JSObject* game;
    JSObject* render;

    Handle<Value> eval(const char* script);

    Local<Context> GetV8Context();
    Handle<Object> SetupProcessObject();
    Local<Script> loadScript(const char* path);
};

#endif /* defined(__v8__Application__) */
