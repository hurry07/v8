//
//  ObjectBasic.h
//  v8
//
//  Created by jie on 13-8-12.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__ObjectBasic__
#define __v8__ObjectBasic__

#include <v8.h>
#include <string>

using namespace v8;

#define WRAP_DEFINE \
virtual void init(const FunctionCallbackInfo<Value> &args);\
static const char* getClassName();\
static void initPrototype(Local<ObjectTemplate>& obj);\
static void initInstance(Local<ObjectTemplate>& obj);\

#define WRAP_BRIDGE_EMPTY(name) \
const char* name::getClassName() {\
    return std::string(#name).c_str();\
}\
void name::initPrototype(Local<ObjectTemplate>& obj) {\
    obj->SetAccessor(String::New("release"), getRelease<name>);\
}\
void name::initInstance(Local<ObjectTemplate>& obj) {\
}

#define WRAP_IMPL_EMPTY(name) \
void name::init(const FunctionCallbackInfo<Value> &args) {\
}\
WRAP_BRIDGE_EMPTY(name)

#endif /* defined(__v8__ObjectBasic__) */
