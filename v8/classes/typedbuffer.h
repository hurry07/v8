//
//  typedbuffer.h
//  v8
//
//  Created by jie on 13-8-21.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_typedbuffer_h
#define v8_typedbuffer_h

#include <v8.h>
#include "buffers.h"
#include "../core/ClassWrap.h"

//static ClassType getArrayClassType(ExternalArrayType type) {
//    switch (type) {
//        case kExternalByteArray:
//            return CLASS_Int8Array;
//        case kExternalUnsignedByteArray:
//            return CLASS_Uint8Array;
//        case kExternalShortArray:
//            return CLASS_Int16Array;
//        case kExternalUnsignedShortArray:
//            return CLASS_Uint16Array;
//        case kExternalIntArray:
//            return CLASS_Int32Array;
//        case kExternalUnsignedIntArray:
//            return CLASS_Uint32Array;
//        case kExternalFloatArray:
//            return CLASS_Float32Array;
//        case kExternalDoubleArray:
//            return CLASS_Float64Array;
//        case kExternalPixelArray:
//            return CLASS_Int8Array;
//    }
//    return CLASS_NULL;
//}

template <typename T>
class TypedBuffer : public NodeBufferView {
public:
    TypedBuffer();
    virtual ~TypedBuffer();

    virtual T get_(long index);
    virtual void set_(long index, T value);

    /**
     * set values in array, return values set.
     * do not judge any array out of bound exception
     */
    virtual long get_a(long index, T* dest, int length);
    virtual long set_a(long index, T* value, int length);

    virtual void subarray(TypedBuffer<T>* arr, int begin, int end);

    virtual ClassType getClassType();
    static class_struct* getExportStruct();
    
    virtual void init(const FunctionCallbackInfo<Value> &args);
//    virtual void releasePersistent();

private:
    static int mElementBytes;
    static const char* mClassName;
    static ClassType mClassType;

    NodeBuffer* mBuffer;
};

template <typename T>
static void initWithArray(TypedBuffer<T>* buffer, Handle<Array>& array);

#define INIT_WITH_ARRAY(T, getter) \
void initWithArray(TypedBuffer<T>* buffer, Handle<Array>& array) {\
    for (int i = 0, aLen = array->Length(); i < aLen; i++) {\
        buffer->set_(i, array->Get(i)->getter());\
    }\
}
INIT_WITH_ARRAY(int8_t, Int32Value);
INIT_WITH_ARRAY(uint8_t, Uint32Value);
INIT_WITH_ARRAY(int16_t, Int32Value);
INIT_WITH_ARRAY(uint16_t, Uint32Value);
INIT_WITH_ARRAY(int32_t, Int32Value);
INIT_WITH_ARRAY(uint32_t, Uint32Value);
INIT_WITH_ARRAY(float, NumberValue);
INIT_WITH_ARRAY(double, NumberValue);

static int getElemenetSize(ClassType type) {
    switch (type) {
        case CLASS_Int8Array:
        case CLASS_Uint8Array:
            return 1;
        case CLASS_Int16Array:
        case CLASS_Uint16Array:
            return 2;
        case CLASS_Int32Array:
        case CLASS_Uint32Array:
        case CLASS_Float32Array:
            return 4;
        case CLASS_Float64Array:
            return 8;
        default:
            return 1;
    }
}

template <typename T>
TypedBuffer<T>::TypedBuffer() : mBuffer(0) {
}
template <typename T>
TypedBuffer<T>::~TypedBuffer() {
}
template <typename T>
void TypedBuffer<T>::subarray(TypedBuffer<T>* arr, int begin, int end) {
}

template <typename T>
void TypedBuffer<T>::init(const FunctionCallbackInfo<Value> &args) {
    if(args.Length() == 0 || !args.IsConstructCall()) {
        return;
    }

    Local<Object> typed = args.This();
    if(args[0]->IsTypedArray()) {
    } else if(args[0]->IsArray()) {
        Local<Object> buffer = ClassWrap<NodeBuffer>::newInstance();
        typed->Set(String::New("buffer"), buffer, PropertyAttribute(ReadOnly | DontDelete));

        Handle<Array> array = Handle<Array>::Cast(args[0]);
        mBuffer = internalPtr<NodeBuffer>(buffer);
        mBuffer->allocate(array->Length() * mElementBytes);

        initWithArray(this, array);
    } else {
        ClassBase* ptr = internalArg<ClassBase>(args[0]);
        if(ptr == 0) {
            return;
        }
        if(ptr->getClassType() == CLASS_ArrayBuffer) {
            if(args.Length() == 1) {
                mBuffer = internalArg<NodeBuffer>(args[0]);
                mByteOffset = 0;
                mByteLength = 0;
            }
        }
    }
}

template <typename T>
T TypedBuffer<T>::get_(long index) {
    return mBuffer->_read<T>(mByteOffset + index * mElementBytes, mElementBytes);
}
template <typename T>
void TypedBuffer<T>::set_(long index, T value) {
    mBuffer->_write<T>(mByteOffset + index * mElementBytes, mElementBytes, value);
}
template <typename T>
long TypedBuffer<T>::get_a(long index, T* dest, int length) {
    return mBuffer->_readDatas<T>(mByteOffset + index * mElementBytes, mElementBytes, dest, length);
}
template <typename T>
long TypedBuffer<T>::set_a(long index, T* dest, int length) {
    return mBuffer->_writeDatas<T>(mByteOffset + index * mElementBytes, mElementBytes, dest, length);
}

/**
 * methods of interface ArrayBufferView
 */
template <typename T>
static void byteOffset(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    ClassBase* ptr = internalPtr<ClassBase>(info);
    if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
        return;
    }
    NodeBufferView* view = static_cast<NodeBufferView*>(ptr);
    info.GetReturnValue().Set(Integer::New(view->mByteOffset));
}
template <typename T>
static void byteLength(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    ClassBase* ptr = internalPtr<ClassBase>(info);
    if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
        return;
    }
    NodeBufferView* view = static_cast<NodeBufferView*>(ptr);
    info.GetReturnValue().Set(Integer::New(view->mByteLength));
}

/**
 * methods of TypedArray
 */
template <typename T>
static void length(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    ClassBase* ptr = internalPtr<ClassBase>(info);
    if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
        return;
    }
    NodeBufferView* view = static_cast<NodeBufferView*>(ptr);
    info.GetReturnValue().Set(Integer::New(view->mByteLength / getElemenetSize(ptr->getClassType())));
}
/**
 * operation []
 */
template <typename T>
static void getByIndex(uint32_t index, const PropertyCallbackInfo<Value>& info) {
    ClassBase* ptr = internalPtr<ClassBase>(info);
    if(ptr == 0 || ptr->getClassType() != TypedBuffer<T>::getExportStruct()->mType) {
        return;
    }

    TypedBuffer<T>* view = static_cast<TypedBuffer<T>*>(ptr);
    if(index >= view->mByteLength / TypedBuffer<T>::mElementBytes) {
        return;
    }

    switch (TypedBuffer<T>::mClassType) {
        case CLASS_Int8Array:
        case CLASS_Int16Array:
        case CLASS_Int32Array:
            info.GetReturnValue().Set(Integer::New(view->get_(index)));
            break;
        case CLASS_Uint8Array:
        case CLASS_Uint16Array:
        case CLASS_Uint32Array:
            info.GetReturnValue().Set(Integer::NewFromUnsigned(view->get_(index)));
            break;
        default:
            info.GetReturnValue().Set(Number::New(view->get_(index)));
            break;
    }
}
template <typename T>
static void setByIndex(uint32_t index, Local<Value> value, const PropertyCallbackInfo<Value>& info) {
    ClassBase* ptr = internalPtr<ClassBase>(info);
    if(ptr == 0 || ptr->getClassType() != TypedBuffer<T>::getExportStruct()->mType) {
        return;
    }
    
    TypedBuffer<T>* view = static_cast<TypedBuffer<T>*>(ptr);
    if(index >= view->mByteLength / TypedBuffer<T>::mElementBytes) {
        return;
    }

    switch (TypedBuffer<T>::mClassType) {
        case CLASS_Int8Array:
        case CLASS_Int16Array:
        case CLASS_Int32Array:
            view->set_(index, value->Int32Value());
            break;
        case CLASS_Uint8Array:
        case CLASS_Uint16Array:
        case CLASS_Uint32Array:
            view->set_(index, value->Uint32Value());
            break;
        default:
            view->set_(index, value->NumberValue());
            break;
    }
}


template <typename T>
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("byteOffset"), byteOffset<T>);
    obj->SetAccessor(String::New("byteLength"), byteLength<T>);
    obj->SetAccessor(String::New("length"), length<T>);
    obj->SetIndexedPropertyHandler(getByIndex<T>, setByIndex<T>);

    return scope.Close(temp->GetFunction());
}

template <typename T>
class_struct* TypedBuffer<T>::getExportStruct() {
    static class_struct mTemplate = {
        initClass, TypedBuffer<T>::mClassName, TypedBuffer<T>::mClassType
    };
    return &mTemplate;
}
template <typename T>
ClassType TypedBuffer<T>::getClassType() {
    return TypedBuffer<T>::mClassType;
}

#define TYPED_ATTAY_DEFINE(T, unit, type)\
template<> int TypedBuffer<T>::mElementBytes = unit;\
template<> const char* TypedBuffer<T>::mClassName = #type;\
template<> ClassType TypedBuffer<T>::mClassType = CLASS_##type

TYPED_ATTAY_DEFINE(int8_t, 1, Int8Array);
TYPED_ATTAY_DEFINE(uint8_t, 1, Uint8Array);
TYPED_ATTAY_DEFINE(int16_t, 2, Int16Array);
TYPED_ATTAY_DEFINE(uint16_t, 2, Uint16Array);
TYPED_ATTAY_DEFINE(int32_t, 4, Int32Array);
TYPED_ATTAY_DEFINE(uint32_t, 4, Uint32Array);
TYPED_ATTAY_DEFINE(float, 4, Float32Array);
TYPED_ATTAY_DEFINE(double, 8, Float64Array);

#endif
