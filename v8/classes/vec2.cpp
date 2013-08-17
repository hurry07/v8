//
//  vec2.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec2.h"
#include "../core/v8Utils.h"

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
    switch (info.Length()) {
        default:
        case 2:
            mVec.y = V_2F(1);
        case 1:
            mVec.x = V_2F(0);
        case 0:
            break;
    }
}
const char* Vec2::toString() {
    char us[100];
    memset(us,100,0x00);
    int len = sprintf(us,"[vec2 {x:%f, y:%f}]", mVec.x, mVec.y);
    return std::string(us, len).c_str();
}
