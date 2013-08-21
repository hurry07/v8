#ifndef __v8__Vec4_inl__
#define __v8__Vec4_inl__

#include "ptr_util.h"

#define VERTEX_UNDERLYING(clzName, T, fType, size)\
template <> void clzName<T>::getUnderlying(Feature* feature) {\
    feature->mPtr = glm::value_ptr(mVec);\
    feature->mSize = size;\
    feature->mType = fType;\
}


#define VERTEX_IMPL(clzName, size) \
template <typename T>\
class_struct* clzName<T>::getExportStruct() {\
    static class_struct mTemplate = {\
        0, "vec"#size, CLASS_VEC##size\
    };\
    return &mTemplate;\
}\
template <typename T>\
ClassType clzName<T>::getClassType() {\
    return getExportStruct()->mType;\
}\
template <typename T>\
const char* clzName<T>::toString() {\
    return printValue(#clzName, glm::value_ptr(mVec), size);\
}\
template <typename T>\
void clzName<T>::init(const FunctionCallbackInfo<Value> &info) {\
    LOGI("vector.init");\
    if(info.Length() == 0) {\
        return;\
    }\
    T values[size];\
    flatVector<T>(info, values, size);\
    fill_value_ptr<T>(glm::value_ptr(mVec), values, size);\
}\
VERTEX_UNDERLYING(clzName, float, FEATURE_FLOAT, size)\
VERTEX_UNDERLYING(clzName, int, FEATURE_INT, size)\
VERTEX_UNDERLYING(clzName, bool, FEATURE_BOOL, size)

VERTEX_IMPL(Vec2, 2);
VERTEX_IMPL(Vec3, 3);
VERTEX_IMPL(Vec4, 4);

template <typename T>
Vec2<T>::Vec2() : mVec(0,0) {
}
template <typename T>
Vec3<T>::Vec3() : mVec(0,0,0) {
}
template <typename T>
Vec4<T>::Vec4() : mVec(0,0,0,0) {
}

#endif /* defined(__v8__Vec4_inl__) */
