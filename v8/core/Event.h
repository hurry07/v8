//
//  Event.h
//  v8
//
//  Created by jie on 13-9-10.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Event__
#define __v8__Event__

#include "../modules/eventstructor.h"
#include "JSObject.h"
#include "ClassBase.h"
#include <v8.h>

using namespace v8;

/**
 * event data access exposed to js
 */
class EventAccessor : public ClassBase {
public:
    EventAccessor();
    virtual ~EventAccessor();
    virtual void init(const FunctionCallbackInfo<Value> &args);

    static class_struct* getExportStruct();
    virtual ClassType getClassType();

    EventStructor* mStruct;
};

/**
 * event data setter in cpp
 */
class TouchEvent : public JSObject {
public:
    TouchEvent(Handle<Object> obj);
    virtual ~TouchEvent();

    EventStructor* mStruct;

    virtual bool appendMouseTouch(int button, int state, int x, int y);
    virtual bool appendMouseMove(int x, int y);
    virtual bool appendKeyPress(unsigned char key, int x, int y);
};

#endif /* defined(__v8__Event__) */
