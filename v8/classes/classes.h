//
//  classes.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_classes_h
#define v8_classes_h

#include <v8.h>
#include "Point.h"
#include "matrix4.h"
#include "vec2.h"
#include "vec3.h"
#include "vec4.h"

void exposeClasses(v8::Local<v8::Object> global) {
    ClassWrap<Point>::expose(global);
    ClassWrap<Matrix4>::expose(global);
    ClassWrap<Vec2>::expose(global);
    ClassWrap<Vec3>::expose(global);
    ClassWrap<Vec4>::expose(global);
}

#endif
