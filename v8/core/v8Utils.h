//
//  v8Utils.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_v8Utils_h
#define v8_v8Utils_h

#define EXPOSE_METHOD(obj, name, attribute) obj->Set(String::New(#name), FunctionTemplate::New(name), PropertyAttribute(attribute))
#define METHOD_BEGIN(name, param) static void name(const FunctionCallbackInfo<Value>& param)

// mast be called with a HandleScope
template<typename T>
static T* internalPtr(const FunctionCallbackInfo<Value>& info) {
    Local<Object> self = info.Holder();
    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
    return static_cast<T*>(wrap->Value());
}
template<typename T>
static T* internalPtr(Handle<Object>& self) {
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    return 0;
}

#endif
