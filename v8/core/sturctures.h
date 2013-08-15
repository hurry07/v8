//
//  sturctures.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_sturctures_h
#define v8_sturctures_h

#include <v8.h>
#include "../classes/classenum.h"

typedef void (*export_func) ();
typedef void (*template_func) (v8::Local<v8::ObjectTemplate>& obj);
typedef void (*instance_func) (const v8::FunctionCallbackInfo<v8::Value> &args);

struct class_struct {
    export_func initClass;
    template_func initPrototype;
    template_func initInstance;

    const char* mClassName;
    ClassType mType;
};

#endif
