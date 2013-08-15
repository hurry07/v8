//
//  Matrix.cpp
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "matrix.h"
#include <glm/gtc/matrix_transform.hpp>
#include "../core/v8Utils.h"

Matrix::Matrix() : mMatrix(1) {
}

METHOD_BEGIN(rotate, info) {
    Matrix* m = internalPtr<Matrix>(info);
    LOGI("matrix.rotate ====");
}
METHOD_BEGIN(translate, info) {
    Matrix* m = internalPtr<Matrix>(info);
    LOGI("matrix.translate ====");
}
static void initPrototype(Local<v8::ObjectTemplate> &obj) {
    EXPOSE_METHOD(obj, rotate, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, translate, ReadOnly | DontDelete);
}
class_struct* Matrix::getExportStruct() {
    static class_struct mTemplate = {
        0, initPrototype, 0, "matrix", CLASS_MATRIX4
    };
    return &mTemplate;
}
ClassType Matrix::getClassType() {
    return getExportStruct()->mType;
}
