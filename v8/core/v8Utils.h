//
//  v8Utils.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_v8Utils_h
#define v8_v8Utils_h

#include "ClassBase.h"

#define EXPOSE_PROPERTY(obj, name, attribute) obj->Set(String::New(#name), FunctionTemplate::New(name), PropertyAttribute(attribute))
#define EXPOSE_METHOD(obj, name, attribute) obj->Set(String::New(#name), FunctionTemplate::New(name), PropertyAttribute(attribute))
#define EXPOSE_METHOD_NAME(obj, mname, name, attribute) obj->Set(String::New(#mname), FunctionTemplate::New(name), PropertyAttribute(attribute))
#define EXPOSE_TEMPLATE_METHOD(obj, name, attribute) obj->Set(String::New(#name), FunctionTemplate::New(name<T>), PropertyAttribute(attribute))
#define METHOD_BEGIN(name, param) static void name(const FunctionCallbackInfo<Value>& param)
#define INS_METHOD_BEGIN(T, name, param) void T::name(const FunctionCallbackInfo<Value>& param)

#define V_2F(index) info[index]->NumberValue()

// mast be called with a HandleScope
template<typename T>
static T* internalPtr(const FunctionCallbackInfo<Value>& info) {
    Local<Object> self = info.This();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    return 0;
}
template<typename T>
static T* internalPtr(const FunctionCallbackInfo<Value>& info, ClassType type) {
    Local<Object> self = info.This();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        ClassBase* base = static_cast<ClassBase*>(wrap->Value());
        if(base->getClassType() == type) {
            return static_cast<T*>(base);
        }
    }
    return 0;
}


template<typename T>
static T* internalPtr(const PropertyCallbackInfo<Value>& info) {
    Local<Object> self = info.This();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    return 0;
}
template<typename T>
static T* internalPtr(const PropertyCallbackInfo<Value>& info, ClassType type) {
    Local<Object> self = info.This();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        ClassBase* base = static_cast<ClassBase*>(wrap->Value());
        if(base->getClassType() == type) {
            return static_cast<T*>(base);
        }
    }
    return 0;
}


template<typename T>
static T* internalPtr(Handle<Object>& self) {
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    return 0;
}
template<typename T>
static T* internalPtr(Handle<Object>& self, ClassType type) {
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        ClassBase* base = static_cast<ClassBase*>(wrap->Value());
        if(base->getClassType() == type) {
            return static_cast<T*>(base);
        }
    }
    return 0;
}


template<typename T>
static T* internalArg(Local<Value> val) {
    Local<Object> self = val->ToObject();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    return 0;
}

template<typename T>
static T* internalArg(Local<Value> val, ClassType type) {
    Local<Object> self = val->ToObject();
    if(self.IsEmpty()) {
        return 0;
    }
    if(self->InternalFieldCount() == 1) {
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        ClassBase* base = static_cast<ClassBase*>(wrap->Value());
        if(base->getClassType() == type) {
            return static_cast<T*>(base);
        }
    }
    return 0;
}

template <typename T>
static T unwrap(Local<Value> arg);// unwrap v8::Object to raw

#define JS_UNWRAP(T, getter) \
template<> T unwrap<T>(Local<Value> arg) {\
    return arg->getter();\
}

JS_UNWRAP(int8_t, Int32Value);
JS_UNWRAP(uint8_t, Uint32Value);
JS_UNWRAP(int16_t, Int32Value);
JS_UNWRAP(uint16_t, Uint32Value);
JS_UNWRAP(int32_t, Int32Value);
JS_UNWRAP(uint32_t, Uint32Value);
JS_UNWRAP(float, NumberValue);
JS_UNWRAP(double, NumberValue);

template <typename T>
static int populateValues(T* dest, Handle<Array>& array, int left=0) {
    int initial = left;
    for(int i = 0, len = array->Length(); i < len; i++) {
        *(dest++) = unwrap<T>(array->Get(i));
        if(left-- == 0) {
            break;
        }
    }
    return initial == 0 ? array->Length() : initial - left;
}

#endif
