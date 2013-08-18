//
//  Vec4.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Vec4__
#define __v8__Vec4__

#include "../core/ClassBase.h"
#include "../core/v8Utils.h"
#include <glm/glm.hpp>
#include <glm/gtc/type_ptr.hpp>
#include "vectorutil.h"

// ========================== vec4
#define VECTOR_DECLEAR(clzName, size)\
template <typename T>\
class clzName : public ClassBase {\
public:\
    clzName();\
    static class_struct* getExportStruct();\
    virtual ClassType getClassType();\
    void init(const FunctionCallbackInfo<Value> &info);\
    virtual const char* toString();\
    glm::detail::tvec##size<T> mVec;\
\
    virtual void get_value(T** outer, int* plen);\
}

VECTOR_DECLEAR(Vec2, 2);
VECTOR_DECLEAR(Vec3, 3);
VECTOR_DECLEAR(Vec4, 4);

#endif /* defined(__v8__Vec4__) */
