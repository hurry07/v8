//
//  Matrix.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Matrix__
#define __v8__Matrix__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Matrix : public ClassBase {
public:
    Matrix();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();

private:
    glm::mat4 mMatrix;
};

#endif /* defined(__v8__Matrix__) */
