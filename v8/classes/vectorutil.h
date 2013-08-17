//
//  vectorutil.h
//  v8
//
//  Created by jie on 13-8-17.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_vectorutil_h
#define v8_vectorutil_h

#include "vec4.h"
#include "vec3.h"
#include "vec2.h"
#include "../core/v8Utils.h"
#include <glm/gtc/type_ptr.hpp>

/**
 * copy vector to a float array
 */
static void flatVector(const FunctionCallbackInfo<Value> &info, float* values, int length) {
    int copyed = 0;
    float* ptr = 0;
    int plen = 0;

    int alen = info.Length();
    for(int i = 0; i < alen; i++) {
        ClassBase* p = internalArg<ClassBase>(info[i]);
        if(p == 0) {
            float f = V_2F(i);
            values[copyed++] = (float)V_2F(i);
        } else {
            plen = 0;
            switch (p->getClassType()) {
                case CLASS_VEC4:
                    ptr = glm::value_ptr(static_cast<Vec4*>(p)->mVec);
                    plen = 4;
                    break;
                case CLASS_VEC3:
                    ptr = glm::value_ptr(static_cast<Vec3*>(p)->mVec);
                    plen = 3;
                    break;
                case CLASS_VEC2:
                    ptr = glm::value_ptr(static_cast<Vec2*>(p)->mVec);
                    plen = 2;
                    break;
            }
            if(plen > length - copyed) {
                while (copyed < length) {
                    values[copyed++] = *ptr;
                    ptr++;
                }
            } else {
                while (plen > 0) {
                    values[copyed++] = *ptr;
                    ptr++;
                    plen--;
                }
            }
        }
        if(copyed == length) {
            break;
        }
    }

    while (copyed < length) {
        values[copyed++] = 0;
    }
}

#endif
