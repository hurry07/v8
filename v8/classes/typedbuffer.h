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

private:
    static int mElementBytes;
    static const char* mClassName;
    static ClassType mClassType;
    int mLength;
};

template <typename T>
TypedBuffer<T>::TypedBuffer() {
}
template <typename T>
TypedBuffer<T>::~TypedBuffer() {
}
template <typename T>
void TypedBuffer<T>::subarray(TypedBuffer<T>* arr, int begin, int end) {
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
class_struct* TypedBuffer<T>::getExportStruct() {
    static class_struct mTemplate = {
        0, TypedBuffer<T>::mClassName, TypedBuffer<T>::mClassType
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
