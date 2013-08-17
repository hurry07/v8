//
//  vec4.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec4.h"
#include "vectorutil.h"

Vec4::Vec4() : mVec(0,0,0,0) {
}
class_struct* Vec4::getExportStruct() {
    static class_struct mTemplate = {
        0, "vec4", CLASS_VEC4
    };
    return &mTemplate;
}
ClassType Vec4::getClassType() {
    return getExportStruct()->mType;
}
void Vec4::init(const FunctionCallbackInfo<Value> &info) {
    if(info.Length() == 0) {
        return;
    }
    float values[4];
    flatVector(info, values, 4);
    mVec.x = values[0];
    mVec.y = values[1];
    mVec.z = values[2];
    mVec.w = values[3];
}
const char* Vec4::toString() {
    char us[100];
    memset(us,100,0x00);
    int len = sprintf(us,"[vec4 {x:%f, y:%f, z:%f, w:%f}]", mVec.x, mVec.y, mVec.z, mVec.w);
    return std::string(us, len).c_str();
}
