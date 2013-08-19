//
//  ptr_util.h
//  v8
//
//  Created by jie on 13-8-18.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_ptr_util_h
#define v8_ptr_util_h

#include "../core/ClassBase.h"
#include "../core/v8Utils.h"

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
static void flatVector(const FunctionCallbackInfo<Value> &info, T* values, int length) {
    int copyed = 0;
    float* ptr = 0;
    int plen = 0;
    FeaturePtr<float> fPtr;

    int alen = info.Length();
    for(int i = 0; i < alen; i++) {
        ClassBase* p = internalArg<ClassBase>(info[i]);
        if(p == 0) {
            argValue(info, i, values + copyed);
            copyed++;
        } else {
            fPtr.mSize = 0;
            p->getFeature(&fPtr);
            ptr = fPtr.mPtr;
            plen = fPtr.mSize;

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

template <typename T>
void fill_value_ptr(T* dest, T* from, int size) {
    for(int i = 0;i < size; i++) {
        dest[i] = from[i];
    }
}

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
