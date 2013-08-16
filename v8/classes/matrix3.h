//
//  Matrix3.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Matrix3__
#define __v8__Matrix3__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Matrix3 : public ClassBase {
public:
    Matrix3();

    static class_struct* getExportStruct();
    virtual ClassType getClassType();
    virtual void init(const FunctionCallbackInfo<Value> &args);
    
    glm::mat3 mMatrix;
};

#endif /* defined(__v8__Matrix3__) */
