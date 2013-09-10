//
//  Event.cpp
//  v8
//
//  Created by jie on 13-9-10.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "Event.h"
#include "v8Utils.h"
#include "../typedbuffer/arraybufferview.h"

METHOD_BEGIN(getEvent, info) {
    HandleScope scope;
    if(info.Length() == 0) {
        return;
    }
    EventAccessor* event = internalPtr<EventAccessor>(info, CLASS_EVENT);
    if(event == 0) {
        return;
    }
    
    // dest buffer
    ClassBase* ptr = internalArg<ClassBase>(info[0]);
    if(ptr == 0 || !NodeBuffer::isView(ptr->getClassType())) {
        info.GetReturnValue().Set(false);
        return;
    }
    NodeBufferView* view = (NodeBufferView*)(ptr);
    
    // source data
    DataRange* range = event->mStruct->startRead();
    if(range->isEmpty()) {
        info.GetReturnValue().Set(false);
        return;
    }
    
    // data copy
    range->read(view->value_ptr());
    range->end();
    info.GetReturnValue().Set(true);
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, getEvent, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}

EventAccessor::EventAccessor() : mStruct(0) {
}
EventAccessor::~EventAccessor() {
    if(mStruct != 0) {
        delete mStruct;
    }
}
void EventAccessor::init(const FunctionCallbackInfo<Value> &args) {
    if(args.Length() != 2) {
        ThrowException(String::New("EventAccessor.init arguments number error, 2 expected"));
    }
    int stride = args[0]->Uint32Value();
    int count = args[1]->Uint32Value();
    mStruct = new EventStructor(stride, count);
}
class_struct* EventAccessor::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "EventAccess", CLASS_EVENT
    };
    return &mTemplate;
}
ClassType EventAccessor::getClassType() {
    return getExportStruct()->mType;
}

TouchEvent::TouchEvent(Handle<Object> obj) : JSObject(obj) {
    EventAccessor* acc = internalPtr<EventAccessor>(obj, CLASS_EVENT);
    if(acc == 0) {
        LOGE("TouchEvent init error, object is not instance of EventAccessor");
        return;
    }
    mStruct = acc->mStruct;
}
TouchEvent::~TouchEvent() {
    mStruct = 0;
}
bool TouchEvent::appendMouseTouch(int button, int state, int x, int y) {
    DataRange* target =mStruct->startWrite();
    if(target->isEmpty()) {
        return false;
    }

    int* dest = target->value_ptr<int>();
    dest[0] = button;
    dest[1] = state;
    dest[2] = x;
    dest[3] = y;
    target->next();
    target->end();
    return true;
}
bool TouchEvent::appendMouseMove(int x, int y) {
    DataRange* target =mStruct->startWrite();
    if(target->isEmpty()) {
        return false;
    }

    int* dest = target->value_ptr<int>();
    dest[0] = -1;
    dest[1] = -1;
    dest[2] = x;
    dest[3] = y;
    target->next();
    target->end();
    return true;
}
bool TouchEvent::appendKeyPress(unsigned char key, int x, int y) {
    DataRange* target = mStruct->startWrite();
    if(target->isEmpty()) {
        return false;
    }

    int* dest = target->value_ptr<int>();
    dest[0] = key;
    dest[1] = x;
    dest[2] = y;
    target->next();
    target->end();
    return true;
}
