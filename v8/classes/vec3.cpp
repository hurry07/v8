//
//  vec3.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec3.h"
#include "vec2.h"
#include "../core/v8Utils.h"
#include "vectorutil.h"

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
    if(info.Length() == 0) {
        return;
    }
    float values[3];
    flatVector(info, values, 3);
    mVec.x = values[0];
    mVec.y = values[1];
    mVec.z = values[2];
}
const char* Vec3::toString() {
    char us[100];
    memset(us,100,0x00);
    int len = sprintf(us,"[vec3 {x:%f, y:%f, z:%f}]", mVec.x, mVec.y, mVec.z);
    return std::string(us, len).c_str();
}
