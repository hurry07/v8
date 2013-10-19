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

#include "../glm/glmopt.h"
#include "../glm/matrix.h"
#include "../glm/matrix_inl.h"
#include "../glm/vector.h"
#include "../glm/vector_inl.h"
#include "../typedbuffer/typedbuffer.h"
#include "../core/ClassWrap.h"
#include "file.h"
#include "../modules/Image.h"
#include "../modules/Event.h"
#include "gcobserver.h"
#include "Font.h"
#include "TextureAtlas.h"
#include "AutoRelease.h"

template<> void Module<NativeClass>::init(const v8::FunctionCallbackInfo<Value>& args) {
    HandleScope scope;
    Local<Object> global = args[0]->ToObject();

    ClassWrap<Glm>::expose(global);
    ClassWrap<JSFile>::expose(global);
    
    ClassWrap<NodeBuffer>::expose(global);
    ClassWrap<TypedBuffer<int8_t> >::expose(global);
    ClassWrap<TypedBuffer<uint8_t> >::expose(global);
    ClassWrap<TypedBuffer<int16_t> >::expose(global);
    ClassWrap<TypedBuffer<uint16_t> >::expose(global);
    ClassWrap<TypedBuffer<int32_t> >::expose(global);
    ClassWrap<TypedBuffer<uint32_t> >::expose(global);
    ClassWrap<TypedBuffer<float> >::expose(global);
    ClassWrap<TypedBuffer<double> >::expose(global);

    ClassWrap<Vec4<int32_t> >::expose("vec4i", global);
    ClassWrap<Vec3<int32_t> >::expose("vec3i", global);
    ClassWrap<Vec2<int32_t> >::expose("vec2i", global);

    ClassWrap<Vec4<int16_t> >::expose("vec4s", global);
    ClassWrap<Vec3<int16_t> >::expose("vec3s", global);
    ClassWrap<Vec2<int16_t> >::expose("vec2s", global);
    
    ClassWrap<Vec4<uint16_t> >::expose("vec4us", global);
    ClassWrap<Vec3<uint16_t> >::expose("vec3us", global);
    ClassWrap<Vec2<uint16_t> >::expose("vec2us", global);
    
    ClassWrap<Vec4<float> >::expose("vec4f", global);
    ClassWrap<Vec3<float> >::expose("vec3f", global);
    ClassWrap<Vec2<float> >::expose("vec2f", global);

    ClassWrap<Vec4<uint8_t> >::expose("vec4b", global);
    ClassWrap<Vec3<uint8_t> >::expose("vec3b", global);
    ClassWrap<Vec2<uint8_t> >::expose("vec2b", global);

    ClassWrap<Mat2<int32_t> >::expose("mat2i", global);
    ClassWrap<Mat3<int32_t> >::expose("mat3i", global);
    ClassWrap<Mat4<int32_t> >::expose("mat4i", global);
    
    ClassWrap<Mat2<uint8_t> >::expose("mat2b", global);
    ClassWrap<Mat3<uint8_t> >::expose("mat3b", global);
    ClassWrap<Mat4<uint8_t> >::expose("mat4b", global);
    
    ClassWrap<Mat2<float> >::expose("mat2f", global);
    ClassWrap<Mat3<float> >::expose("mat3f", global);
    ClassWrap<Mat4<float> >::expose("mat4f", global);

    // alines
    ClassWrap<Mat4<float> >::expose("matrix", global);
    ClassWrap<Mat4<float> >::expose("matrix4", global);
    ClassWrap<Mat3<float> >::expose("matrix3", global);
    ClassWrap<Mat2<float> >::expose("matrix2", global);

    ClassWrap<Vec3<float> >::expose("vector", global);
    ClassWrap<Vec4<float> >::expose("vector4", global);
    ClassWrap<Vec3<float> >::expose("vector3", global);
    ClassWrap<Vec2<float> >::expose("vector2", global);

    ClassWrap<Font>::expose(global);
    ClassWrap<TextureAtlas>::expose(global);

    ClassWrap<AutoRelease>::expose(global);

    ClassWrap<GcObserver>::expose(global);// watch if gc could happen
    ClassWrap<Image>::expose(global);
    ClassWrap<EventAccessor>::expose(global);
}

template<> const char* Module<NativeClass>::mFile = __FILE__;
template<> const char* Module<NativeClass>::mName = "node_nativeclasses";
