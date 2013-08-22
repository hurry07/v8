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
#include "arraybuffer.h"
#include "typedbuffer.h"
#include "../core/ClassWrap.h"

template<> void Module<NativeClass>::init(const FunctionCallbackInfo<Value>& args) {
    HandleScope scope;
    Local<Object> global = args[0]->ToObject();

    ClassWrap<Glm>::expose(global);
    ClassWrap<Point>::expose(global);
    ClassWrap<JSFile>::expose(global);
    
    ClassWrap<NodeBuffer>::expose(global);
    ClassWrap<TypedBuffer<int8_t>>::expose(global);
    ClassWrap<TypedBuffer<uint8_t>>::expose(global);
    ClassWrap<TypedBuffer<int16_t>>::expose(global);
    ClassWrap<TypedBuffer<uint16_t>>::expose(global);
    ClassWrap<TypedBuffer<int32_t>>::expose(global);
    ClassWrap<TypedBuffer<uint32_t>>::expose(global);
    ClassWrap<TypedBuffer<float>>::expose(global);
    ClassWrap<TypedBuffer<double>>::expose(global);

    ClassWrap<Vec4<float>>::expose("vec4f", global);
    ClassWrap<Vec4<int32_t>>::expose("vec4i", global);
    ClassWrap<Vec4<uint8_t>>::expose("vec4b", global);
    ClassWrap<Vec3<float>>::expose("vec3f", global);
    ClassWrap<Vec3<int32_t>>::expose("vec3i", global);
    ClassWrap<Vec3<uint8_t>>::expose("vec3b", global);
    ClassWrap<Vec2<float>>::expose("vec2f", global);
    ClassWrap<Vec2<int32_t>>::expose("vec2i", global);
    ClassWrap<Vec2<uint8_t>>::expose("vec2b", global);

    ClassWrap<Mat2<float>>::expose("mat2f", global);
    ClassWrap<Mat2<int32_t>>::expose("mat2i", global);
    ClassWrap<Mat2<uint8_t>>::expose("mat2b", global);
    ClassWrap<Mat3<float>>::expose("mat3f", global);
    ClassWrap<Mat3<int32_t>>::expose("mat3i", global);
    ClassWrap<Mat3<uint8_t>>::expose("mat3b", global);
    ClassWrap<Mat4<float>>::expose("mat4f", global);
    ClassWrap<Mat4<int32_t>>::expose("mat4i", global);
    ClassWrap<Mat4<uint8_t>>::expose("mat4b", global);

    // alines
    ClassWrap<Mat4<float>>::expose("matrix", global);
    ClassWrap<Mat4<float>>::expose("matrix4", global);
    ClassWrap<Mat3<float>>::expose("matrix3", global);
    ClassWrap<Mat2<float>>::expose("matrix2", global);

    ClassWrap<Vec3<float>>::expose("vector", global);
    ClassWrap<Vec4<float>>::expose("vector4", global);
    ClassWrap<Vec3<float>>::expose("vector3", global);
    ClassWrap<Vec2<float>>::expose("vector2", global);
}

template<> const char* Module<NativeClass>::mFile = __FILE__;
template<> const char* Module<NativeClass>::mName = "node_nativeclasses";
