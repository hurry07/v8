//
//  Weak.h
//  v8
//
//  Created by jie on 13-10-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Weak__
#define __v8__Weak__

#include "../core/ClassBase.h"
#include <v8.h>
using namespace v8;

class WeakRef : public ClassBase{
public:
    Persistent<Object> target;
    Persistent<Array>  callbacks;

	WeakRef();
	~WeakRef();

    virtual void init(const v8::FunctionCallbackInfo<Value> &args);
	virtual void doRelease();
	static class_struct* getExportStruct();
	virtual ClassType getClassType();
};

#endif /* defined(__v8__Weak__) */
