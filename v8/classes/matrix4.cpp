//
//  Matrix4.cpp
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "matrix4.h"
#include <glm/gtc/matrix_transform.hpp>
#include "../core/v8Utils.h"

Matrix4::Matrix4() : mMatrix(1) {
}
Matrix4::~Matrix4() {
}
INS_METHOD_BEGIN(Matrix4, init, args) {
}
METHOD_BEGIN(mul, info) {
}
METHOD_BEGIN(inverse, info) {
    Matrix4* m = internalPtr<Matrix4>(info);

    if(info.Length() == 1) {// inverse to a dest matrix
        Matrix4* infoM = internalPtr_<Matrix4>(info[0]->ToObject());
        infoM->mMatrix = m->mMatrix;
        glm::inverse(infoM->mMatrix);
    } else {
        glm::inverse(m->mMatrix);
    }
}
METHOD_BEGIN(rotate, info) {
    Matrix4* m = internalPtr<Matrix4>(info);
}
METHOD_BEGIN(translate, info) {
    Matrix4* m = internalPtr<Matrix4>(info);
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, inverse, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, rotate, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, translate, ReadOnly | DontDelete);
    
    Local<Function> mulFn = FunctionTemplate::New(mul)->GetFunction();
    obj->Set(String::New("mul"), mulFn, PropertyAttribute(ReadOnly | DontDelete));

    Local<Function> expFn = temp->GetFunction();
    return scope.Close(expFn);
}
class_struct* Matrix4::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "matrix4", CLASS_MATRIX4
    };
    return &mTemplate;
}
ClassType Matrix4::getClassType() {
    return getExportStruct()->mType;
}
