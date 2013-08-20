//
//  ClassBase.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "ClassBase.h"

ClassBase::ClassBase() : mRelease(true), mReferCount(0) {
}
ClassBase::~ClassBase() {
}

void ClassBase::release() {
    if(!mRelease) {
        doRelease();
        mRelease = true;
    }
}
void ClassBase::doRelease() {
}
void ClassBase::init(const FunctionCallbackInfo<Value> &args) {
}
class_struct* ClassBase::getExportStruct() {
    return 0;
}
ClassType ClassBase::getClassType() {
    return CLASS_NULL;
}
bool ClassBase::isReleased() {
    return mRelease;
}
const char* ClassBase::toString() {
    return "[object native]";
}
void ClassBase::getUnderlying(Feature *feature) {
}
void ClassBase::makeRefer() {
    mReferCount++;
}
void ClassBase::disposeRefer() {
    if(--mReferCount == 0) {
        release();
        delete this;
    }
}
void ClassBase::releasePersistent() {
    disposeRefer();
}
