//
//  ptr_util.h
//  v8
//
//  Created by jie on 13-8-18.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_ptr_util_h
#define v8_ptr_util_h

#include "vector.h"
#include "matrix.h"

static void argValue(const FunctionCallbackInfo<Value> &info, int index, float* slot) {
    *slot = info[index]->NumberValue();
}
static void argValue(const FunctionCallbackInfo<Value> &info, int index, bool* slot) {
    *slot = info[index]->BooleanValue();
}
static void argValue(const FunctionCallbackInfo<Value> &info, int index, int* slot) {
    *slot = info[index]->Int32Value();
}

template <typename T>
static void valuePtr(ClassBase* obj, T** outer, int* plen) {
    switch (obj->getClassType()) {
        case CLASS_VEC4:
            static_cast<Vec4<T>*>(obj)->get_value(outer, plen);
            break;
        case CLASS_VEC3:
            static_cast<Vec3<T>*>(obj)->get_value(outer, plen);
            break;
        case CLASS_VEC2:
            static_cast<Vec2<T>*>(obj)->get_value(outer, plen);
            break;
        case CLASS_MATRIX4:
            static_cast<Matrix4<T>*>(obj)->get_value(outer, plen);
            break;
        case CLASS_MATRIX3:
            static_cast<Matrix3<T>*>(obj)->get_value(outer, plen);
            break;
        case CLASS_MATRIX2:
            static_cast<Matrix2<T>*>(obj)->get_value(outer, plen);
            break;
        default:
            *plen = 0;
            break;
    }
}
template <typename T>
static void flatVector(const FunctionCallbackInfo<Value> &info, T* values, int length) {
    int copyed = 0;
    float* ptr = 0;
    int plen = 0;

    int alen = info.Length();
    for(int i = 0; i < alen; i++) {
        ClassBase* p = internalArg<ClassBase>(info[i]);
        if(p == 0) {
            argValue(info, i, values + copyed);
            copyed++;
        } else {
            valuePtr(p, &ptr, &plen);
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
