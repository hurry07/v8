//
//  vectorutil.h
//  v8
//
//  Created by jie on 13-8-17.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_vectorutil_h
#define v8_vectorutil_h

#include <stdlib.h>

#include "../core/v8Utils.h"
#include <glm/gtc/type_ptr.hpp>

static std::string int2str(int value) {
    char* us = new char[25];
    int len = sprintf(us, "%d", value);
    std::string s = std::string(us, len).c_str();
    delete[] us;
    return s.c_str();
}
static std::string float2str(float value) {
    char* us = new char[40];
    int len = sprintf(us, "%f", value);
    std::string s = std::string(us, len).c_str();
    delete[] us;
    return s.c_str();
}

#define PTR_TOSTRING(T, fn) \
static const char* printValue(const char* name, T* ptr, int length, int step=0) {\
    std::string buf;\
    buf.append("[");\
    buf.append(name);\
    buf.append("{");\
    if(step != 0) {\
        buf.append("\n");\
    }\
    if(length > 0) {\
        buf.append(fn(ptr[0]));\
        for (int i = 1; i < length; i++) {\
            buf.append(", ");\
            if((i % step) == 0) {\
                buf.append("\n");\
            }\
            buf.append(fn(ptr[i]));\
        }\
    }\
    buf.append("}]");\
    return buf.c_str();\
}

PTR_TOSTRING(int, int2str);
PTR_TOSTRING(float, float2str);
PTR_TOSTRING(bool, int2str);

template <typename T>
void fill_value_ptr(T* dest, T* from, int size) {
    for(int i = 0;i < size; i++) {
        dest[i] = from[i];
    }
}

#endif
