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
#include "sturctures.h"

using namespace v8;

class ByteBuffer;

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

    /**
     * init value after constructor
     */
    virtual void init(const FunctionCallbackInfo<Value> &args);
    /**
     * change value at any time
     */
    virtual void reset(const FunctionCallbackInfo<Value> &args);
    /**
     * get and set underlying of this object
     */
    virtual void _value(const FunctionCallbackInfo<Value> &args);
    virtual const char* toString();

    /**
     * you can overwrite this method if you want a deep copy
     */
    template<class T>
    static void onClone(T& current, const T& from) {
    }

    virtual ClassType getClassType();
    static class_struct* getExportStruct();

    /**
     * if js has call release on this object
     */
    virtual bool isReleased();
    /**
     * interact without class type message
     */
    virtual void getUnderlying(ByteBuffer* feature);
    /**
     * a special kind of disposet refer, called when js does not ref this object.
     */
    virtual void releasePersistent();

protected:
	bool mRelease;// has release called on current instance
};

#endif /* defined(__v8__ClassBase__) */
