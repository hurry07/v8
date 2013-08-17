//
//  vec4.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec4.h"

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
