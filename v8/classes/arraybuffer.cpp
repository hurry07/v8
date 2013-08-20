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
NodeBuffer::~NodeBuffer() {
    if(mLength > 0) {
        delete[] mData;
    }
}
void NodeBuffer::init(const FunctionCallbackInfo<Value> &args) {
}

static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
//    EXPOSE_METHOD(obj, loadAsset, ReadOnly | DontDelete);
//    EXPOSE_METHOD(obj, getContent, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}
class_struct* NodeBuffer::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "ArrayBuffer", CLASS_ARRAY_BUFFER
    };
    return &mTemplate;
}
ClassType NodeBuffer::getClassType() {
    return NodeBuffer::getExportStruct()->mType;
}
void NodeBuffer::getFeature(Feature* feature) {
}
void NodeBuffer::onClone(NodeBuffer& current, const NodeBuffer& from) {
    if(from.mLength == 0) {
        return;
    }
    current.mData = new char[current.mLength = from.mLength];
}
