//
//  vec2.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__vec2__
#define __v8__vec2__

#include "../core/ClassBase.h"
#include <glm/glm.hpp>

class Vec2 : public ClassBase {
public:
    Vec2();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();
private:
    glm::vec2 mVec;
};

#endif /* defined(__v8__vec2__) */
