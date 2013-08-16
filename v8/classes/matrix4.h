//
//  Matrix4.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Matrix4__
#define __v8__Matrix4__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Matrix4 : public ClassBase {
public:
    Matrix4();
    virtual ~Matrix4();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();
    virtual void init(const FunctionCallbackInfo<Value> &args);
    
    glm::mat4 mMatrix;
    int test1 = 100;
};

#endif /* defined(__v8__Matrix4__) */
