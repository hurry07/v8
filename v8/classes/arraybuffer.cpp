//
//  ArrayBuffer.cpp
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "arraybuffer.h"
#include "../core/v8Utils.h"

NodeBuffer::NodeBuffer() : mData(0), mLength(0) {
}
NodeBuffer::NodeBuffer(int length) : mData(0), mLength(0) {
    if(length > 0) {
        mData = new char[mLength = length];
    }
}
NodeBuffer::~NodeBuffer() {
    if(mLength > 0) {
        delete[] mData;
    }
}
void NodeBuffer::init(const FunctionCallbackInfo<Value> &args) {
}
static void byteLength(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    LOGI("get byteLength");
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("byteLength"), byteLength);
//    EXPOSE_METHOD(obj, loadAsset, ReadOnly | DontDelete);
//    EXPOSE_METHOD(obj, getContent, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}
class_struct* NodeBuffer::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "ArrayBuffer", CLASS_ArrayBuffer
    };
    return &mTemplate;
}
ClassType NodeBuffer::getClassType() {
    return NodeBuffer::getExportStruct()->mType;
}

void NodeBuffer::getUnderlying(Feature* feature) {
}
void NodeBuffer::onClone(NodeBuffer& current, const NodeBuffer& from) {
    if(from.mLength == 0) {
        return;
    }
    current.mData = new char[current.mLength = from.mLength];
}
long NodeBuffer::writeBytes(long offset, char* bytes, long length) {
    if(offset < 0 || offset + length > mLength) {
        LOGE("ArrayBuffer write excceed from:%ld write:%ld length:%ld", offset, length, mLength);
        if(offset < 0) {
            offset = 0;
        }
        if(offset + length > mLength) {
            length = mLength - offset;
        }
    }
    memcpy(mData, bytes, length);
    return length;
}
long NodeBuffer::readBytes(long offset, char* dest, long length) {
    if(offset < 0 || offset + length > mLength) {
        LOGE("ArrayBuffer write excceed from:%ld write:%ld length:%ld", offset, length, mLength);
        if(offset < 0) {
            offset = 0;
        }
        if(offset + length > mLength) {
            length = mLength - offset;
        }
    }
    memcpy(dest, mData, length);
    return length;
}
