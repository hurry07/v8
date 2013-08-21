//
//  ArrayBuffer.cpp
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "arraybuffer.h"
#include "../core/v8Utils.h"
#include "../core/ClassWrap.h"

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
    if(args.IsConstructCall()) {
        if (args.Length() == 1) {
            long size = args[0]->IntegerValue();
            if(size > 0) {
                allocate(size);
            }
        }
        LOGI("NodeBuffer.init:%s", getExportStruct()->mClassName);
    }
}
void NodeBuffer::allocate(long size) {
    mData = new char[mLength = size];
    std::fill_n(mData, mLength, 0);
}
bool NodeBuffer::isView(ClassType type) {
    if(type >= CLASS_Int8Array && type <= CLASS_Float64Array) {
        return true;
    }
    return false;
}

static void byteLength(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    ClassBase* t = internalPtr<ClassBase>(info);
    if(t == 0 || t->getClassType() != CLASS_ArrayBuffer) {
        info.GetReturnValue().Set(Integer::New(0));
        return;
    }
    NodeBuffer* p = static_cast<NodeBuffer*>(t);
    info.GetReturnValue().Set(Integer::New(p->mLength));
}
METHOD_BEGIN(isView, info) {
    ClassBase* t = 0;
    if(info.Length() > 0) {
        t = internalArg<ClassBase>(info[0]);
    } else {
        t = internalPtr<ClassBase>(info);
    }
    if(t != 0) {
        ClassType tType = t->getClassType();
        if(NodeBuffer::isView(tType)) {
            info.GetReturnValue().Set(v8::True());
            return;
        }
    }
    info.GetReturnValue().Set(v8::False());
}
METHOD_BEGIN(slice, info) {
    int acount = info.Length();
    if(acount == 0) {
        return;
    }
    
    ClassBase* t = internalPtr<ClassBase>(info);
    if(t != 0 && t->getClassType() == NodeBuffer::getExportStruct()->mType) {
        if(!info[0]->IsInt32Array()) {
            return;
        }

        long start = info[0]->IntegerValue();
        long end = 0;
        NodeBuffer* current = static_cast<NodeBuffer*>(t);
        if (acount == 2) {
            if(!info[1]->IsInt32Array()) {
                return;
            }
            end = info[0]->IntegerValue();
        } else {
            end = current->mLength;
        }
        if(start < 0) {
            start += current->mLength;
        }
        if(end < 0) {
            end += current->mLength;
        }

        Handle<Object> dest = ClassWrap<NodeBuffer>::newInstance();
        long length = end - start;
        if(start < 0 || start >= current->mLength) {
            info.GetReturnValue().Set(dest);
            return;
        }
        if(start + length > current->mLength) {
            length = current->mLength - start;
        }

        NodeBuffer* bufPtr = internalPtr<NodeBuffer>(dest);
        bufPtr->mData = new char[bufPtr->mLength = length];
        bufPtr->writeBytes(0, current->mData + start, length);
        info.GetReturnValue().Set(dest);
    }
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("byteLength"), byteLength);
    EXPOSE_METHOD(obj, slice, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, isView, ReadOnly | DontDelete);
    
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
