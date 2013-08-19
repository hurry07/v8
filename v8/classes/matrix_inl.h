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

template <typename T>
void orderPtr(T* dest, T* from, int size, int stride = 0) {
    if(stride == 0) {
        return;
    }
    for(int i = 0; i < size; i++) {
        int col = i % stride;
        int row = i / stride;
        dest[col * stride + row] = from[i];
    }
}

#define MATRIX_IMPL(clzName, size, sizepwo) \
template <typename T>\
clzName<T>::clzName() {\
}\
template <typename T>\
clzName<T>::~clzName() {\
}\
template <typename T>\
ClassType clzName<T>::getClassType() {\
    return getExportStruct()->mType;\
}\
template <typename T>\
const char* clzName<T>::toString() {\
    T values[sizepwo];\
    orderPtr(values, glm::value_ptr(mMatrix), sizepwo, size);\
    return printValue(#clzName"_"#size, values, sizepwo, size);\
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

#define MATIRX_INIT(clzName, size)\
template <typename T>\
class_struct* clzName<T>::getExportStruct() {\
    static class_struct mTemplate = {\
        0, "matrix"#size, CLASS_MATRIX##size\
    };\
    return &mTemplate;\
}

MATRIX_IMPL(Mat4, 4, 16);
MATRIX_IMPL(Mat3, 3, 9);
MATIRX_INIT(Mat3, 3);
MATRIX_IMPL(Mat2, 2, 4);
MATIRX_INIT(Mat2, 2);

template <typename T>
class_struct* Mat4<T>::getExportStruct() {
    static class_struct mTemplate = {
        0, "matrix4", CLASS_MATRIX4
    };
    return &mTemplate;
}

// export methods for float matrix
METHOD_BEGIN(translate, info) {
    HandleScope scope;
    if(info.Length() == 0) {
        return;
    }

    Matrix* m = internalPtr<Matrix>(info);
    Vector* v = internalArg<Vector>(info[0], CLASS_VEC3);
    if(v == 0) {
        int size = 3;
        float values[size];
        flatVector<float>(info, values, size);
        glm::vec3 v3;
        fill_value_ptr<float>(glm::value_ptr(v3), values, size);
        m->mMatrix = glm::translate(m->mMatrix, v3);
    } else {
        m->mMatrix = glm::translate(m->mMatrix, v->mVec);
    }
}
METHOD_BEGIN(rotate, info) {
    HandleScope scope;
    if(info.Length() == 0) {
        return;
    }
    
    Matrix* m = internalPtr<Matrix>(info);
    float arc = (float)V_2F(0);
    Vector* aix = internalArg<Vector>(info[1]);
    
    m->mMatrix = glm::rotate(m->mMatrix, arc, aix->mVec);
}
METHOD_BEGIN(scale, info) {
    HandleScope scope;
    if(info.Length() == 0) {
        return;
    }
    
    Matrix* m = internalPtr<Matrix>(info);
    Vector* v = internalArg<Vector>(info[0], CLASS_VEC3);

    if(v == 0) {
        int size = 3;
        float values[size];
        flatVector<float>(info, values, size);
        glm::vec3 v3;
        fill_value_ptr<float>(glm::value_ptr(v3), values, size);
        m->mMatrix = glm::scale(m->mMatrix, v3);
    } else {
        m->mMatrix = glm::scale(m->mMatrix, v->mVec);
    }
}
METHOD_BEGIN(identity, info) {
    HandleScope scope;
    
    Matrix* m = internalPtr<Matrix>(info);
    m->mMatrix = glm::mat4(1);
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, translate, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, rotate, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, scale, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, identity, ReadOnly | DontDelete);

    return scope.Close(temp->GetFunction());
}

template<> class_struct* Mat4<float>::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "matrix4", CLASS_MATRIX4
    };
    return &mTemplate;
}

#endif /* defined(__v8__Matrix_inl__) */