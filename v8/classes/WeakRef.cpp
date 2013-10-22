//
//  Weak.cpp
//  v8
//
//  Created by jie on 13-10-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "WeakRef.h"
#include "v8.h"
#include "node.h"
#include "../core/v8Utils.h"

#define TOLOCAL(persist, type) Local<type>::New(Isolate::GetCurrent(), persist)


//Handle<Value> WeakNamedPropertyGetter(Local<String> property, const AccessorInfo& info) {
//    UNWRAP
//    return dead ? Local<Value>() : obj->Get(property);
//}
//
//Handle<Value> WeakNamedPropertySetter(Local<String> property, Local<Value> value, const AccessorInfo& info) {
//    UNWRAP
//    if (!dead) obj->Set(property, value);
//    return value;
//}
//
//Handle<Integer> WeakNamedPropertyQuery(Local<String> property, const AccessorInfo& info) {
//    return HandleScope().Close(Integer::New(None));
//}
//
//Handle<Boolean> WeakNamedPropertyDeleter(Local<String> property, const AccessorInfo& info) {
//    UNWRAP
//    return Boolean::New(!dead && obj->Delete(property));
//}
//
//Handle<Value> WeakIndexedPropertyGetter(uint32_t index, const AccessorInfo& info) {
//    UNWRAP
//    return dead ? Local<Value>() : obj->Get(index);
//}
//
//Handle<Value> WeakIndexedPropertySetter(uint32_t index, Local<Value> value, const AccessorInfo& info) {
//    UNWRAP
//    if (!dead) obj->Set(index, value);
//    return value;
//}
//
//Handle<Integer> WeakIndexedPropertyQuery(uint32_t index, const AccessorInfo& info) {
//    return HandleScope().Close(Integer::New(None));
//}
//
//Handle<Boolean> WeakIndexedPropertyDeleter(uint32_t index, const AccessorInfo& info) {
//    UNWRAP
//    return Boolean::New(!dead && obj->Delete(index));
//}
//
//Handle<Array> WeakPropertyEnumerator(const AccessorInfo& info) {
//    UNWRAP
//    return HandleScope().Close(dead ? Array::New(0) : obj->GetPropertyNames());
//}
//void Initialize(Handle<Object> target) {
//    HandleScope scope;
//
//    Local<ObjectTemplate> objClass = ObjectTemplate::New();
//    proxyClass.Reset(Isolate::New(), objClass);
//    proxyClass->SetNamedPropertyHandler(WeakNamedPropertyGetter,
//                                        WeakNamedPropertySetter,
//                                        WeakNamedPropertyQuery,
//                                        WeakNamedPropertyDeleter,
//                                        WeakPropertyEnumerator);
//    proxyClass->SetIndexedPropertyHandler(WeakIndexedPropertyGetter,
//                                          WeakIndexedPropertySetter,
//                                          WeakIndexedPropertyQuery,
//                                          WeakIndexedPropertyDeleter,
//                                          WeakPropertyEnumerator);
//    proxyClass->SetInternalFieldCount(1);
//
//    NODE_SET_METHOD(target, "get", Get);
//    NODE_SET_METHOD(target, "create", Create);
//    NODE_SET_METHOD(target, "isWeakRef", IsWeakRef);
//    NODE_SET_METHOD(target, "isNearDeath", IsNearDeath);
//    NODE_SET_METHOD(target, "isDead", IsDead);
//    NODE_SET_METHOD(target, "callbacks", Callbacks);
//    NODE_SET_METHOD(target, "addCallback", AddCallback);
//}

METHOD_BEGIN(isDead, info) {
    HandleScope scope;
    WeakRef* proxy = internalPtr<WeakRef>(info);
    if(proxy == 0 || proxy->target.IsEmpty()) {
        info.GetReturnValue().Set(true);
    } else {
        info.GetReturnValue().Set(false);
    }
}
METHOD_BEGIN(callbacks, info) {
    HandleScope scope;
    WeakRef* proxy = internalPtr<WeakRef>(info);
    if(proxy == 0 || proxy->target.IsEmpty()) {
        return;
    }
    info.GetReturnValue().Set(Local<Array>::New(Isolate::GetCurrent(), proxy->callbacks));
}
METHOD_BEGIN(addCallback, info) {
    HandleScope scope;
    if(info.Length() == 0) {
        return;
    }
    WeakRef* proxy = internalPtr<WeakRef>(info);
    if(proxy == 0 || proxy->target.IsEmpty()) {
        return;
    }
    Local<Array> array = Local<Array>::New(Isolate::GetCurrent(), proxy->callbacks);
    array->Set(Integer::New(array->Length()), info[0]);
}
METHOD_BEGIN(isNearDeath, info) {
    HandleScope scope;
    WeakRef* proxy = internalPtr<WeakRef>(info);
    if(proxy == 0 || proxy->target.IsEmpty()) {
        return;
    }
    info.GetReturnValue().Set(proxy->target.IsNearDeath());
}
METHOD_BEGIN(get, info) {
    HandleScope scope;
    WeakRef* proxy = internalPtr<WeakRef>(info);
    if(proxy == 0 || proxy->target.IsEmpty()) {
        return;
    }
    info.GetReturnValue().Set(Local<Object>::New(Isolate::GetCurrent(), proxy->target));
}

static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, get, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, isNearDeath, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, isDead, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, callbacks, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, addCallback, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}

void TargetCallback(Isolate* isolate, Persistent<Object>* target, WeakRef* arg) {
    HandleScope scope;
    if(!arg->target.IsNearDeath()) {
        return;
    }

    Local<Object> fnthis = Local<Object>::New(Isolate::GetCurrent(), arg->target);
    Handle<Value> argv[1];
    argv[0] = fnthis;

    // invoke any listening callbacks
    Local<Array> callbacks = Local<Array>::New(Isolate::GetCurrent(), arg->callbacks);
    uint32_t len = callbacks->Length();
    for (uint32_t i = 0; i < len; i++) {
        Handle<Function> cb = Handle<Function>::Cast(callbacks->Get(i));
        TryCatch try_catch;
        cb->Call(fnthis, 1, argv);
        if (try_catch.HasCaught()) {
            ThrowException(String::New("TargetCallback"));
        }
    }

    target->Dispose();
    target->Clear();
    arg->callbacks.Dispose();
    arg->callbacks.Clear();
}

WeakRef::WeakRef() {
}
WeakRef::~WeakRef() {
}
void WeakRef::doRelease() {
    target.Dispose();
    target.Clear();
    callbacks.Dispose();
    callbacks.Clear();
}
void WeakRef::init(const v8::FunctionCallbackInfo<Value> &info) {
    HandleScope scope;
    if (!info[0]->IsObject()) {
        Local<String> message = String::New("Object expected");
        ThrowException(Exception::TypeError(message));
    }

    Local<Array> array = Array::New();
    callbacks.Reset(Isolate::GetCurrent(), array);
    target.Reset(Isolate::GetCurrent(), info[0]->ToObject());
    target.MakeWeak(this, TargetCallback);

    if (info.Length() >= 2) {
        array->Set(Integer::New(array->Length()), info[1]);
    }
}
class_struct* WeakRef::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "weak", CLASS_Weak
    };
    return &mTemplate;
}
ClassType WeakRef::getClassType() {
    return getExportStruct()->mType;
}
