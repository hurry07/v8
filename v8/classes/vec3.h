//
//  vec3.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__vec3__
#define __v8__vec3__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Vec3 : public ClassBase {
public:
    Vec3();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();
    void init(const FunctionCallbackInfo<Value> &args);
    virtual const char* toString();

    glm::vec3 mVec;
};

#endif /* defined(__v8__vec3__) */
