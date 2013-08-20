//
//  ClassBase.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__ClassBase__
#define __v8__ClassBase__

#include <v8.h>
#include <string>
#include "../global.h"
#include "../classes/classenum.h"
#include "sturctures.h"
#include "Feature.h"

using namespace v8;

class ClassBase {
public:
	ClassBase();
    /*
     * release resource other than jsRelease
     */
	virtual ~ClassBase();
    
    /**
     * instance should release resource in this method.
     * this method may be call many times
     */
	virtual void release();
    virtual void doRelease();

    virtual void init(const FunctionCallbackInfo<Value> &args);
    virtual const char* toString();

    /**
     * you can overwrite this method if you want a deep copy
     */
    template<class T>
    static void onClone(const T& current, const T& from) {
    }

    virtual ClassType getClassType();
    static class_struct* getExportStruct();
    virtual bool isReleased();
    /**
     * interact without class type message
     */
    virtual void getUnderlying(Feature* feature);
    /**
     * call when object other than current object's wrapper has a refer to this object
     */
    virtual void makeRefer();
    /**
     * dispose that refer
     */
    virtual void disposeRefer();
    /**
     * a special kind of disposet refer, called when js does not ref this object.
     */
    virtual void releasePersistent();

protected:
	bool mRelease;// has release called on current instance
    int mReferCount;// other object that refer to current object
};

#endif /* defined(__v8__ClassBase__) */
