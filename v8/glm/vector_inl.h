#ifndef __v8__Vec4_inl__
#define __v8__Vec4_inl__

#include "../classes/ptr_util.h"

#define VERTEX_UNDERLYING(clzName, T, fType, size)\
template<> void clzName<T>::getUnderlying(ByteBuffer* feature) {\
    feature->mPtr = (char*)glm::value_ptr(mVec);\
    feature->mByteLength = size * sizeof(T);\
    feature->mElement = fType;\
    feature->mElementSize = sizeof(T);\
}

#define VERTEX_IMPL(clzName, size) \
template <typename T>\
class_struct* clzName<T>::getExportStruct() {\
    static class_struct mTemplate = {\
        glm_vector::initVectorClass<clzName<T>, T>, "vec"#size, CLASS_VEC##size\
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
    HandleScope scope;\
    if(info.Length() == 0) {\
        return;\
    }\
    T values[size];\
    flatVector<T>(info, values, size);\
    fill_value_ptr<T>(glm::value_ptr(mVec), values, size);\
}\
template <typename T>\
void clzName<T>::setValue(const FunctionCallbackInfo<Value> &info) {\
    T values[size];\
    flatVector<T>(info, values, size);\
    fill_value_ptr<T>(glm::value_ptr(mVec), values, size);\
}\
VERTEX_UNDERLYING(clzName, float, CLASS_Float32Array, size)\
VERTEX_UNDERLYING(clzName, int32_t, CLASS_Int32Array, size)\
VERTEX_UNDERLYING(clzName, uint8_t, CLASS_Uint8Array, size)\
VERTEX_UNDERLYING(clzName, int16_t, CLASS_Uint8Array, size)\
VERTEX_UNDERLYING(clzName, uint16_t, CLASS_Uint8Array, size)

namespace glm_vector {
    /**
     * init current object with Array or ArrayBufferView|TypedBuffer
     */
    template <class M>
    void set(const FunctionCallbackInfo<Value> &info);
    
    template <class M, typename T>
    static v8::Local<v8::Function> initVectorClass(v8::Handle<v8::FunctionTemplate>& temp);
}

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
template <typename T>
Vec2<T>::~Vec2() {
//    LOGI("~Vec2");
}
template <typename T>
Vec3<T>::~Vec3() {
//    LOGI("~Vec3");
}
template <typename T>
Vec4<T>::~Vec4() {
//    LOGI("~Vec4");
}

/**
 * init current object with Array or ArrayBufferView|TypedBuffer
 */
template <class M>
void glm_vector::set(const FunctionCallbackInfo<Value> &info) {
    HandleScope scope;
    ClassBase* c = internalPtr<ClassBase>(info, M::getExportStruct()->mType);
    if(c == 0) {
        return;
    }
    M* thiz = static_cast<M*>(c);
    thiz->setValue(info);
}

template <class M, typename T>
static v8::Local<v8::Function> glm_vector::initVectorClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("length"), globalfn::array::length);
    EXPOSE_METHOD_NAME(obj, set, set<M>, ReadOnly | DontDelete);
    
    Local<ObjectTemplate> ins = temp->InstanceTemplate();
    ins->SetIndexedPropertyHandler(globalfn::array::getter<T>, globalfn::array::setter<T>);
    
    return scope.Close(temp->GetFunction());
}

#endif /* defined(__v8__Vec4_inl__) */
