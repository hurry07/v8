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

static int int2str(char* dest, int value) {
    return sprintf(dest, "%d", value);
}
static int float2str(char* dest, float value) {
    return sprintf(dest, "%f", value);
}

#define PTR_TOSTRING(T, fn) \
static const char* printValue(const char* name, T* ptr, int length, int step=0) {\
    char us[30];\
    std::string buf;\
    buf.append("[");\
    buf.append(name);\
    buf.append("{");\
    if(step != 0) {\
        buf.append("\n");\
    }\
    int plen = 0;\
    if(length > 0) {\
        plen = fn(us, ptr[0]);\
        buf.append(us, plen);\
        for (int i = 1; i < length; i++) {\
            buf.append(", ");\
            if(step > 0 && (i % step) == 0) {\
                buf.append("\n");\
            }\
            plen = fn(us, ptr[i]);\
            buf.append(us, plen);\
        }\
    }\
    buf.append("}]");\
    return buf.c_str();\
}

//static const char* printValue(const char* name, float* ptr, int length, int step=0) {\
//    std::string buf;
//    buf.append("[");
//    buf.append(name);
//    buf.append("{");
//    if(step != 0) {
//        buf.append("\n");
//    }
//    if(length > 0) {
//        buf.append(float2str(ptr[0]));
//        for (int i = 1; i < length; i++) {
//            buf.append(", ");
//            if(step > 0 && (i % step) == 0) {
//                buf.append("\n");
//            }
//            buf.append(float2str(ptr[i]));
//        }
//    }
//    buf.append("}]");
//    return buf.c_str();
//}

PTR_TOSTRING(int, int2str);
PTR_TOSTRING(float, float2str);
PTR_TOSTRING(bool, int2str);

#endif
