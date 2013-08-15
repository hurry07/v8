//
//  vec2.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "vec2.h"

Vec2::Vec2() {
}

class_struct* Vec2::getExportStruct() {
    static class_struct mTemplate = {
        0, 0, 0, "vec2", CLASS_VEC2
    };
    return &mTemplate;
}
ClassType Vec2::getClassType() {
    return getExportStruct()->mType;
}
