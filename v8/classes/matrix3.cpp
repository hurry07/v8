//
//  Matrix3.cpp
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "matrix3.h"
#include <glm/gtc/matrix_transform.hpp>
#include "../core/v8Utils.h"

Matrix3::Matrix3() : mMatrix(1) {
}
INS_METHOD_BEGIN(Matrix3, init, args) {
}
METHOD_BEGIN(mul, info) {
}
METHOD_BEGIN(rotate, info) {
    Matrix3* m = internalPtr<Matrix3>(info);
}
METHOD_BEGIN(translate, info) {
    Matrix3* m = internalPtr<Matrix3>(info);
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    
    Local<Function> expFn = temp->GetFunction();
    return scope.Close(expFn);
}
class_struct* Matrix3::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "matrix3", CLASS_MATRIX3
    };
    return &mTemplate;
    return 0;
}
ClassType Matrix3::getClassType() {
    return getExportStruct()->mType;
}

