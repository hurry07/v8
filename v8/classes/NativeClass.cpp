//
//  NativeClass.cpp
//  v8
//
//  Created by jie on 13-8-17.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "NativeClass.h"
#include <v8.h>

using namespace v8;

#include "glmopt.h"
#include "Point.h"
#include "matrix4.h"
#include "matrix3.h"
#include "vec2.h"
#include "vec3.h"
#include "vec4.h"
#include "file.h"
#include "../core/ClassWrap.h"

template<> void Module<NativeClass>::init(const FunctionCallbackInfo<Value>& args) {
    HandleScope scope;
    Local<Object> global = args[0]->ToObject();
    
    ClassWrap<Glm>::expose(global);
    ClassWrap<Point>::expose(global);
    ClassWrap<Matrix3>::expose(global);
    ClassWrap<Matrix4>::expose(global);
    ClassWrap<Vec2>::expose(global);
    ClassWrap<Vec3>::expose(global);
    ClassWrap<Vec4>::expose(global);
    ClassWrap<Vec4>::expose(global);
    ClassWrap<JSFile>::expose(global);
}

template<> const char* Module<NativeClass>::mFile = __FILE__;
template<> const char* Module<NativeClass>::mName = "node_nativeclasses";
