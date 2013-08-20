//
//  NodeBuffer.h
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__NodeBuffer__
#define __v8__NodeBuffer__

#include "../global.h"
#include "classenum.h"
#include "../core/ClassBase.h"
#include "../core/sturctures.h"

class NodeBuffer : public ClassBase {
public:
	NodeBuffer();
	virtual ~NodeBuffer();
    virtual void init(const FunctionCallbackInfo<Value> &args);

    virtual ClassType getClassType();
    static class_struct* getExportStruct();
    virtual void getFeature(Feature* feature);
    static void onClone(NodeBuffer& current, const NodeBuffer& from);

    template<typename T>
    void _write(int offset, T value);
    template<typename T>
    T _read(int offset);

    template<typename T>
    int _writeDatas(int offset, T* value, int length);
    template<typename T>
    int _readDatas(int offset, T* dest, int length);

    /**
     * write byte into current buffer
     * @return bytes written
     */
    virtual int writeBytes(int offset, char* bytes, int length);
    virtual int readBytes(int offset, char* dest, int length);

private:
    int mLength;
    char* mData;
};

template<typename T>
void NodeBuffer::_write(int offset, T value) {
    if(offset < 0 || offset + sizeof(T) > mLength) {
        LOGE("ArrayBuffer write excceed from:%d write:%d length:%d", offset, sizeof(T), mLength);
    }
    static_cast<T*>(mData + offset)[0] = value;
}
template<typename T>
T NodeBuffer::_read(int offset) {
    if(offset < 0 || offset + sizeof(T) > mLength) {
        LOGE("ArrayBuffer read excceed from:%d write:%d length:%d", offset, sizeof(T), mLength);
    }
    return *static_cast<T*>(mData + offset);
}
template<typename T>
int NodeBuffer::_writeDatas(int offset, T* value, int length) {
    int sizeOf = sizeof(T);
    int written = writeBytes(offset, static_cast<char*>(value), length * sizeOf);
    return written / sizeOf;
}
template<typename T>
int NodeBuffer::_readDatas(int offset, T* dest, int length) {
    int sizeOf = sizeof(T);
    int readen = readBytes(offset, static_cast<char*>(dest), length * sizeOf);
    return readen / sizeOf;
}

#endif /* defined(__v8__NodeBuffer__) */
