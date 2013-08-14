//
//  Matrix.cpp
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "Matrix.h"

template<> const char* ClassBase<Matrix>::mName = "matrix";
template<> const ClassType ClassBase<Matrix>::mClassType = CLASS_MATRIX;

static void getPropties(Local<String> property, const PropertyCallbackInfo<Value>& info) {
}
static void setPropties(Local<String> property, Local<Value> value, const PropertyCallbackInfo<Value>& info) {
}
static void query(Local<String> property, const PropertyCallbackInfo<Integer>& info) {
}
static void enumCallback(const PropertyCallbackInfo<Array>& info) {
}
template<> void ClassBase<Matrix>::initClass() {
}
template<> void ClassBase<Matrix>::initPrototype(Local<v8::ObjectTemplate> &obj) {
    obj->SetNamedPropertyHandler(getPropties, setPropties, query, 0, enumCallback);
}
