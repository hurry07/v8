//
//  matrix_inl.h
//  v8
//
//  Created by jie on 13-8-18.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#ifndef __v8__Matrix_inl__
#define __v8__Matrix_inl__

#include "ptr_util.h"
#include <glm/gtc/matrix_transform.hpp>

#define MATRIX_IMPL(clzName, size, sizepwo) \
template <typename T>\
clzName<T>::clzName() {\
    LOGI("maxinit");\
}\
template <typename T>\
clzName<T>::~clzName() {\
}\
template <typename T>\
v8::Local<v8::Function> clzName<T>::initClass(v8::Handle<v8::FunctionTemplate>& temp) {\
    HandleScope scope;\
\
    Local<Function> expFn = temp->GetFunction();\
    return scope.Close(expFn);\
}\
template <typename T>\
class_struct* clzName<T>::getExportStruct() {\
    static class_struct mTemplate = {\
        initClass, "matrix"#size, CLASS_MATRIX##size\
    };\
    return &mTemplate;\
}\
template <typename T>\
ClassType clzName<T>::getClassType() {\
    return getExportStruct()->mType;\
}\
template <typename T>\
const char* clzName<T>::toString() {\
    return printValue(#clzName#size, glm::value_ptr(mMatrix), sizepwo, size);\
}\
template <typename T>\
void clzName<T>::init(const v8::FunctionCallbackInfo<v8::Value> &info) {\
    if(info.Length() == 0) {\
        return;\
    }\
    T values[sizepwo];\
    flatVector<T>(info, values, sizepwo);\
    fill_value_ptr<T>(glm::value_ptr(mMatrix), values, sizepwo);\
}\
template <typename T>\
void clzName<T>::get_value(T** outer, int* plen) {\
    *outer = glm::value_ptr(mMatrix);\
    *plen = sizepwo;\
}

MATRIX_IMPL(Matrix4, 4, 16);
MATRIX_IMPL(Matrix3, 3, 9);
MATRIX_IMPL(Matrix2, 2, 4);

#endif /* defined(__v8__Matrix_inl__) */
