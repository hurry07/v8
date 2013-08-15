//
//  vec4.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__vec4__
#define __v8__vec4__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Vec4 : public ClassBase {
public:
    Vec4();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();
private:
    glm::vec4 mVec;
};

#endif /* defined(__v8__vec4__) */
