//
//  ClassBase.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "ClassBase.h"

ClassBase::ClassBase() : mRelease(false) {
}
ClassBase::~ClassBase() {
}

void ClassBase::release() {
}
void ClassBase::jsRelease() {
    if(!mRelease) {
        release();
        mRelease = true;
    }
}
void ClassBase::init(const FunctionCallbackInfo<Value> &args) {
}
class_struct* ClassBase::getExportStruct() {
    return 0;
}
ClassType ClassBase::getClassType() {
    return CLASS_NULL;
}
