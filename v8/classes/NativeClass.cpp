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
#include "matrix.h"
#include "matrix_inl.h"
#include "vector.h"
#include "vector_inl.h"
#include "file.h"
#include "../core/ClassWrap.h"

template<> void Module<NativeClass>::init(const FunctionCallbackInfo<Value>& args) {
    HandleScope scope;
    Local<Object> global = args[0]->ToObject();

//    ClassWrap<Glm>::expose(global);
    ClassWrap<Point>::expose(global);
    ClassWrap<JSFile>::expose(global);

    ClassWrap<Vec4<float>>::expose("vec4f", global);
    ClassWrap<Vec4<int>>::expose("vec4i", global);
    ClassWrap<Vec4<bool>>::expose("vec4b", global);
    ClassWrap<Vec3<float>>::expose("vec3f", global);
    ClassWrap<Vec3<int>>::expose("vec3i", global);
    ClassWrap<Vec3<bool>>::expose("vec3b", global);
    ClassWrap<Vec2<float>>::expose("vec2f", global);
    ClassWrap<Vec2<int>>::expose("vec2i", global);
    ClassWrap<Vec2<bool>>::expose("vec2b", global);

    ClassWrap<Matrix2<float>>::expose("mat2f", global);
    ClassWrap<Matrix2<int>>::expose("mat2i", global);
    ClassWrap<Matrix2<bool>>::expose("mat2b", global);
    ClassWrap<Matrix3<float>>::expose("mat3f", global);
    ClassWrap<Matrix3<int>>::expose("mat3i", global);
    ClassWrap<Matrix3<bool>>::expose("mat3b", global);
    ClassWrap<Matrix4<float>>::expose("mat4f", global);
    ClassWrap<Matrix4<int>>::expose("mat4i", global);
    ClassWrap<Matrix4<bool>>::expose("mat4b", global);
}

template<> const char* Module<NativeClass>::mFile = __FILE__;
template<> const char* Module<NativeClass>::mName = "node_nativeclasses";
