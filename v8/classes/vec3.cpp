//
//  vec3.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec3.h"
#include "../core/v8Utils.h"

Vec3::Vec3() : mVec(0,0,0) {
}

class_struct* Vec3::getExportStruct() {
    static class_struct mTemplate = {
        0, "vec3", CLASS_VEC3
    };
    return &mTemplate;
}
ClassType Vec3::getClassType() {
    return getExportStruct()->mType;
}
void Vec3::init(const FunctionCallbackInfo<Value> &info) {
    switch (info.Length()) {
        default:
        case 3:
            mVec.z = V_2F(2);
        case 2:
            mVec.y = V_2F(1);
        case 1:
            mVec.x = V_2F(0);
        case 0:
            break;
    }
}
const char* Vec3::toString() {
    char us[100];
    memset(us,100,0x00);
    int len = sprintf(us,"[vec3 {x:%f, y:%f, z:%f}]", mVec.x, mVec.y, mVec.z);
    return std::string(us, len).c_str();
}
