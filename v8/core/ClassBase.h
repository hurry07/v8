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

using namespace v8;

class ClassBase {
public:
	ClassBase();
    /*
     * release resource other than jsRelease
     */
	virtual ~ClassBase();
    
    /**
     * instance should release resource in this method
     */
	virtual void release();
    virtual void jsRelease();
    virtual void init(const FunctionCallbackInfo<Value> &args);

    /**
     * you can overwrite this method if you want a deep copy
     */
    template<class T>
    static void onClone(const T& current, const T& from) {
        LOGI("ClassType.onCopying");
    }
    
    virtual ClassType getClassType();
    static class_struct* getExportStruct();

protected:
	bool mRelease;// has release called on current instance
};

#endif /* defined(__v8__ClassBase__) */
