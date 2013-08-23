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
#include "arraybufferview.h"
#include "../core/ClassWrap.h"
#include "../functions/array.h"

namespace typedbuffer {
    /**
     * create a ArrayBuffer object with given byte length, binding it to current object,
     * and return a pointer to its inner NodeBuffer
     */
    NodeBuffer* createArrayBuffer(Local<Object>& thiz, long length);
    /**
     * init TypedBuffer with array/TypedArray data
     */
    void set(const FunctionCallbackInfo<Value> &info);

    template <typename T>
    void subarray(const FunctionCallbackInfo<Value> &info);
    /**
     * methods of interface ArrayBufferView
     */
    template <typename T>
    void byteOffset(Local<String> property, const PropertyCallbackInfo<Value>& info);
    
    template <typename T>
    void byteLength(Local<String> property, const PropertyCallbackInfo<Value>& info);
    
    template <typename T>
    v8::Local<v8::Function> initTypedArrayClass(v8::Handle<v8::FunctionTemplate>& temp);
}

template <typename T>
class TypedBuffer : public NodeBufferView {
public:
    TypedBuffer();
    virtual ~TypedBuffer();
    virtual void getUnderlying(ByteBuffer* feature);

    virtual T get_(long index);
    virtual void set_(long index, T value);

    /**
     * set values in array, return values set.
     * do not judge any array out of bound exception
     */
    virtual long get_a(long index, T* dest, int length);
    virtual long set_a(long index, T* value, int length);

    virtual ClassType getClassType();
    static class_struct* getExportStruct();

    virtual void init(const FunctionCallbackInfo<Value> &args);
    virtual void initWithArray(Handle<Array>& array, int offset);

    virtual int length();
    virtual long byteOffset(int index);

public:
    static int mElementBytes;
    static const char* mClassName;
    static ClassType mClassType;
};

template <typename T>
TypedBuffer<T>::TypedBuffer() {
//    LOGI("TypedBuffer.create");
}
template <typename T>
TypedBuffer<T>::~TypedBuffer() {
//    LOGI("TypedBuffer.~release");
}
template <typename T>
int TypedBuffer<T>::length() {
    return (int)(mByteLength / mElementBytes);
}
template <typename T>
long TypedBuffer<T>::byteOffset(int index) {
    return mByteOffset + index * mElementBytes;
}
template <typename T>
void TypedBuffer<T>::initWithArray(Handle<Array>& array, int offset) {
    T* buf = (T*)value_ptr();
    for(int i = 0, aLen = array->Length(); i < aLen; i++) {
        *(buf++) = unwrap<T>(array->Get(i));
    }
}

template <typename T>
void TypedBuffer<T>::init(const FunctionCallbackInfo<Value> &args) {
    if(args.Length() == 0 || !args.IsConstructCall()) {
        return;
    }

    Local<Object> thiz = args.This();
    if(args[0]->IsTypedArray()) {

        // TypedArray should not be used here
    } else if(args[0]->IsArray()) {

        // init with raw array
        Handle<Array> array = Handle<Array>::Cast(args[0]);
        mBuffer = typedbuffer::createArrayBuffer(thiz, mByteLength = array->Length() * mElementBytes);

        // populate data
        for(int i = 0, aLen = array->Length(); i < aLen; i++) {
            this->set_(i, unwrap<T>(array->Get(i)));
        }
    } else {

        ClassBase* ptr = internalArg<ClassBase>(args[0]);
        if(ptr == 0) {
            LOGE("TypedArray init error");
            return;
        }

        // a row ArrayBuffer
        if(ptr->getClassType() == CLASS_ArrayBuffer) {

            // init using ArrayBuffer, create a reference to it, and set start and end
            mBuffer = internalArg<NodeBuffer>(args[0]);
            thiz->Set(String::New(NodeBufferView::BUFFER), args[0], PropertyAttribute(ReadOnly | DontDelete));// buffer refer count++

            if(args.Length() == 1) {// ArrayBuffer
                mByteOffset = 0;
                mByteLength = mBuffer->mLength;
                if(mByteLength % mElementBytes != 0) {
                    args.GetReturnValue().Set(ThrowException(String::New("There is bytes left when create TypedBuffer")));
                }
            } else if(args.Length() == 2) {// ArrayBuffer byteOffset
                mByteOffset = args[1]->Int32Value();
                mByteLength = mBuffer->mLength - mByteOffset;
                if(mByteLength % mElementBytes != 0) {
                    args.GetReturnValue().Set(ThrowException(String::New("There is bytes left when create TypedBuffer")));
                }
            } else {
                mByteOffset = args[1]->Int32Value();
                mByteLength = args[2]->Int32Value() * mElementBytes;
                if(mByteOffset + mByteLength > mBuffer->mLength) {
                    args.GetReturnValue().Set(ThrowException(String::New("TypedBuffer's data excceed the capacity of underlying ArrayBuffer")));
                }
            }
        } else if(NodeBuffer::isView(ptr->getClassType())) {

            // init using other TypedArray
            if(ptr->getClassType() == mClassType) {
                NodeBufferView* from = static_cast<NodeBufferView*>(ptr);
                mBuffer = typedbuffer::createArrayBuffer(thiz, mByteLength = from->mByteLength);
                mBuffer->writeBytes(0, from->value_ptr(), mByteLength);
            } else {
                args.GetReturnValue().Set(ThrowException(String::New("TypedArray convert not implemented")));
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
template <typename T>
void TypedBuffer<T>::getUnderlying(ByteBuffer* feature) {
    feature->init(mBuffer, mByteOffset, mByteLength, mClassType, mElementBytes);
}

template <typename T>
class_struct* TypedBuffer<T>::getExportStruct() {
    static class_struct mTemplate = {
        typedbuffer::initTypedArrayClass<T>, TypedBuffer<T>::mClassName, TypedBuffer<T>::mClassType
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

namespace typedbuffer {
    /**
     * create a ArrayBuffer object with given byte length, binding it to current object,
     * and return a pointer to its inner NodeBuffer
     */
    NodeBuffer* createArrayBuffer(Local<Object>& thiz, long length) {
        Local<Object> buffer = ClassWrap<NodeBuffer>::newInstance();
        thiz->Set(String::New(NodeBufferView::BUFFER), buffer, PropertyAttribute(ReadOnly | DontDelete));
        
        NodeBuffer* mBuffer = internalPtr<NodeBuffer>(buffer);
        mBuffer->allocate(length);
        
        return mBuffer;
    }
    
    /**
     * init TypedBuffer with array/TypedArray data
     */
    void set(const FunctionCallbackInfo<Value> &info) {
        HandleScope scope;
        
        if(info.Length() == 0) {
            return;
        }
        
        ClassBase* thiz = internalPtr<ClassBase>(info);
        if(thiz == 0 || !NodeBuffer::isView(thiz->getClassType())) {
            return;
        }
        
        int offset = 0;
        if(info.Length() == 2) {
            offset = info[1]->Uint32Value();
        }
        
        if(info[0]->IsArray()) {
            Handle<Array> array = Handle<Array>::Cast(info[0]);
            int aLen = array->Length();
            
            NodeBufferView* view = static_cast<NodeBufferView*>(thiz);
            ByteBuffer buf;
            thiz->getUnderlying(&buf);
            if(buf.typedLength() < offset + aLen) {
                ThrowException(String::New("TypedArray's set excceed the underlying byffer length"));
                return;
            }
            
            // populate data
            view->initWithArray(array, offset);
        } else {
            ClassBase* valueWrap = internalArg<ClassBase>(info[0]);
            if(valueWrap == 0 || !NodeBuffer::isView(valueWrap->getClassType())) {
                ThrowException(String::New("TypedArray's argument illgle, TypedArray not found"));
                return;
            }
            if(valueWrap->getClassType() != thiz->getClassType()) {
                ThrowException(String::New("TypedArray's argument type conflict"));
                return;
            }
            
            NodeBufferView* view = static_cast<NodeBufferView*>(thiz);
            ByteBuffer buf;
            thiz->getUnderlying(&buf);
            
            NodeBufferView* valuePtr = static_cast<NodeBufferView*>(valueWrap);
            if(buf.typedLength() < offset + valuePtr->mByteLength / buf.mElementSize) {
                ThrowException(String::New("TypedArray's set excceed the underlying TypedArray length"));
                return;
            }
            
            if(valuePtr->mBuffer == view->mBuffer) {
                // according to the specification, we should have another copy of these bytes before clone it
                char* temp = new char[valuePtr->mByteLength];
                valuePtr->readBytes(0, temp, valuePtr->mByteLength);
                view->writeBytes(offset * buf.mElementSize, temp, valuePtr->mByteLength);
                delete[] temp;
            } else {
                view->writeBytes(offset * buf.mElementSize, valuePtr->value_ptr(), valuePtr->mByteLength);
            }
        }
    }
    
    template <typename T>
    void subarray(const FunctionCallbackInfo<Value> &info) {
        HandleScope scope;
        if(info.Length() == 0) {
            ThrowException(String::New("TypeBuffer splice illigal argument number:0"));
            return;
        }
        
        ClassBase* thiz = internalPtr<ClassBase>(info);
        if(thiz == 0 || thiz->getClassType() != TypedBuffer<T>::getExportStruct()->mType) {
            return;
        }
        
        TypedBuffer<T>* thizPtr = static_cast<TypedBuffer<T>*>(thiz);
        int unit = TypedBuffer<T>::mElementBytes;
        int length = thizPtr->length();
        int begin = 0;
        int end = length;
        
        begin = info[0]->Int32Value();
        if(begin < 0) {
            begin += length;
        }
        if(info.Length() == 2) {
            end = info[1]->Int32Value();
            if(end < 0) {
                end += length;
            }
        }
        if(begin < 0 || begin >= length || begin >= end) {
            begin = end = 0;
        } else {
            if(end > length) {
                end = length;
            }
        }
        
        Handle<Object> wrap = info.This();
        Handle<Value> params[3];
        params[0] = wrap->Get(String::New(NodeBufferView::BUFFER));
        params[1] = Integer::New(thizPtr->byteOffset(begin));
        params[2] = Integer::New(end - begin);
        
        Handle<Object> obj = ClassWrap<TypedBuffer<T>>::newInstance(3, params);
        info.GetReturnValue().Set(obj);
    }
    
    /**
     * methods of interface ArrayBufferView
     */
    template <typename T>
    void byteOffset(Local<String> property, const PropertyCallbackInfo<Value>& info) {
        HandleScope scope;
        
        ClassBase* ptr = internalPtr<ClassBase>(info);
        if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
            return;
        }
        NodeBufferView* view = static_cast<NodeBufferView*>(ptr);
        info.GetReturnValue().Set(Integer::New(view->mByteOffset));
    }
    
    template <typename T>
    void byteLength(Local<String> property, const PropertyCallbackInfo<Value>& info) {
        HandleScope scope;
        
        ClassBase* ptr = internalPtr<ClassBase>(info);
        if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
            return;
        }
        NodeBufferView* view = static_cast<NodeBufferView*>(ptr);
        info.GetReturnValue().Set(Integer::New(view->mByteLength));
    }
    
    template <typename T>
    v8::Local<v8::Function> initTypedArrayClass(v8::Handle<v8::FunctionTemplate>& temp) {
        HandleScope scope;
        
        Local<ObjectTemplate> obj = temp->PrototypeTemplate();
        obj->SetAccessor(String::New("byteOffset"), byteOffset<T>);
        obj->SetAccessor(String::New("byteLength"), byteLength<T>);
        obj->SetAccessor(String::New("length"), globalfn::array::length);
        obj->Set(String::New("set"), FunctionTemplate::New(typedbuffer::set), PropertyAttribute(ReadOnly | DontDelete));
        obj->Set(String::New("subarray"), FunctionTemplate::New(typedbuffer::subarray<T>), PropertyAttribute(ReadOnly | DontDelete));
        
        Local<ObjectTemplate> ins = temp->InstanceTemplate();
        ins->SetIndexedPropertyHandler(globalfn::array::getter<T>, globalfn::array::setter<T>);
        
        return scope.Close(temp->GetFunction());
    }
}

#endif
