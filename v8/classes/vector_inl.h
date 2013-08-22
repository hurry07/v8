#ifndef __v8__Vec4_inl__
#define __v8__Vec4_inl__

#include "ptr_util.h"

#define VERTEX_UNDERLYING(clzName, T, fType, size)\
template<> void clzName<T>::getUnderlying(ByteBuffer* feature) {\
    feature->mPtr = (char*)glm::value_ptr(mVec);\
    feature->mByteLength = size * sizeof(T);\
    feature->mElement = fType;\
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
template <typename T>\
void clzName<T>::_value(const FunctionCallbackInfo<Value>& args) {\
    _valueFn(args, sizeof(T), (char*)glm::value_ptr(mVec), size);\
}\
VERTEX_UNDERLYING(clzName, float, CLASS_Float32Array, size)\
VERTEX_UNDERLYING(clzName, int32_t, CLASS_Int32Array, size)\
VERTEX_UNDERLYING(clzName, uint8_t, CLASS_Uint8Array, size)

VERTEX_IMPL(Vec2, 2);
VERTEX_IMPL(Vec3, 3);
VERTEX_IMPL(Vec4, 4);

//template <typename T> 
//void Vec4<T>::_value(const FunctionCallbackInfo<Value>& args) {
//    while (1) {
//        if(args.Length() == 0) {
//            break;
//        }
//        ClassBase* destPtr = internalArg<ClassBase>(args[0]);
//        if(destPtr == 0) {
//            break;
//        }
//
//        ClassType type = destPtr->getClassType();
//        if(type == CLASS_ArrayBuffer) {
//            NodeBuffer* bufPtr = static_cast<NodeBuffer*>(destPtr);
//            bufPtr->_writeDatas(0, 4, glm::value_ptr(mVec), 4);
//            return;
//
//        } else if(NodeBuffer::isView(type)) {
//            // copy value dispite buffer type.
//            NodeBufferView* viewPtr = static_cast<NodeBufferView*>(destPtr);
//            viewPtr->writeBytes(0, (char*)glm::value_ptr(mVec), 4 * 4);
//            return;
//
//        } else {
//            args.GetReturnValue().Set(ThrowException(String::New("_value args[0] cannot be treated as a buffer obejct.")));
//        }
//
//        break;
//    }
//
//    Handle<Object> byteArray = ClassWrap<NodeBuffer>::newInstance(Integer::NewFromUnsigned(4 * 4));
//    NodeBuffer* bPtr = internalPtr<NodeBuffer>(byteArray);
//    bPtr->_writeDatas(0, 4, glm::value_ptr(mVec), 4);
//    args.GetReturnValue().Set(ClassWrap<TypedBuffer<float>>::newInstance(byteArray));
//}

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
