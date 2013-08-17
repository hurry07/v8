//
//  vec2.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec2.h"
#include "../core/v8Utils.h"
#include "vectorutil.h"

Vec2::Vec2() : mVec(0,0) {
}

class_struct* Vec2::getExportStruct() {
    static class_struct mTemplate = {
        0, "vec2", CLASS_VEC2
    };
    return &mTemplate;
}
ClassType Vec2::getClassType() {
    return getExportStruct()->mType;
}
void Vec2::init(const FunctionCallbackInfo<Value> &info) {
    if(info.Length() == 0) {
        return;
    }
    float values[2];
    flatVector(info, values, 2);
    mVec.x = values[0];
    mVec.y = values[1];
}
const char* Vec2::toString() {
    char us[100];
    memset(us,100,0x00);
    int len = sprintf(us,"[vec2 {x:%f, y:%f}]", mVec.x, mVec.y);
    return std::string(us, len).c_str();
}
