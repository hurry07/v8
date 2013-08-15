//
//  vec3.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec3.h"

Vec3::Vec3() {
}

class_struct* Vec3::getExportStruct() {
    static class_struct mTemplate = {
        0, 0, 0, "vec3", CLASS_VEC3
    };
    return &mTemplate;
}
ClassType Vec3::getClassType() {
    return getExportStruct()->mType;
}
