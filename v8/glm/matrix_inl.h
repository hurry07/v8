//
//  matrix_inl.h
//  v8
//
//  Created by jie on 13-8-18.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#ifndef __v8__Matrix_inl__
#define __v8__Matrix_inl__

#include "../classes/ptr_util.h"
#include "vector.h"
#include <glm/gtc/matrix_transform.hpp>
#include "../functions/array.h"

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

#define MATRIX_UNDERLYING(clzName, T, fType, sizepwo)\
template<> void clzName<T>::getUnderlying(ByteBuffer* feature) {\
    feature->mPtr = (char*)glm::value_ptr(mMatrix);\
    feature->mByteLength = sizepwo * sizeof(T);\
    feature->mElement = fType;\
    feature->mElementSize = sizeof(T);\
}
#define MATRIX_IMPL(clzName, size, sizepwo) \
template <typename T>\
clzName<T>::clzName() : mMatrix(1) {\
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
void clzName<T>::_value(const FunctionCallbackInfo<Value>& args) {\
    _valueFn(args, sizeof(T), (char*)glm::value_ptr(mMatrix), sizepwo);\
}\
template <typename T>\
class_struct* clzName<T>::getExportStruct() {\
    static class_struct mTemplate = {\
        initMatrixClass<clzName<T>, T>, "matrix"#size, CLASS_MATRIX##size\
    };\
    return &mTemplate;\
}\
MATRIX_UNDERLYING(clzName, float, CLASS_Float32Array, sizepwo)\
MATRIX_UNDERLYING(clzName, int32_t, CLASS_Int16Array, sizepwo)\
MATRIX_UNDERLYING(clzName, uint8_t, CLASS_Uint8Array, sizepwo)

template <class M, typename T>
static v8::Local<v8::Function> initMatrixClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("length"), globalfn::array::length);

    Local<ObjectTemplate> ins = temp->InstanceTemplate();
    ins->SetIndexedPropertyHandler(globalfn::array::getter<T>, globalfn::array::setter<T>);
    
    return scope.Close(temp->GetFunction());
}

MATRIX_IMPL(Mat3, 3, 9);
MATRIX_IMPL(Mat2, 2, 4);
MATRIX_IMPL(Mat4, 4, 16);

// ====================================
// export more methods for float matrix
// ====================================
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
    obj->SetAccessor(String::New("length"), globalfn::array::length);
    
    Local<ObjectTemplate> ins = temp->InstanceTemplate();
    ins->SetIndexedPropertyHandler(globalfn::array::getter<float>, globalfn::array::setter<float>);

    return scope.Close(temp->GetFunction());
}
template<> class_struct* Mat4<float>::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "matrix4", CLASS_MATRIX4
    };
    return &mTemplate;
}

#endif /* defined(__v8__Matrix_inl__) */
