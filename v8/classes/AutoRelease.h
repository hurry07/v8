//
//  AutoRelease.h
//  v8
//
//  Created by jie on 13-9-27.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__AutoRelease__
#define __v8__AutoRelease__

#include <Opengl/gl3.h>
#include "../core/ClassBase.h"
#include "../autorelease/ReleaseImpl.h"

class AutoRelease : public ClassBase {
public:
	AutoRelease();
	virtual ~AutoRelease();

    virtual void values(const FunctionCallbackInfo<Value>& param);
    virtual void doRelease();
    virtual void init(const FunctionCallbackInfo<Value> &args);
    
    static class_struct* getExportStruct();
    virtual ClassType getClassType();

public:
    ReleaseTask* mTask;
};

#endif /* defined(__v8__AutoRelease__) */