//
//  NodeBuffer.h
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__NodeBuffer__
#define __v8__NodeBuffer__

#include "../global.h"
#include "classenum.h"
#include "../core/ClassBase.h"
#include "../core/sturctures.h"

class NodeBuffer : public ClassBase {
public:
	NodeBuffer();
	virtual ~NodeBuffer();
    virtual void init(const FunctionCallbackInfo<Value> &args);

    virtual ClassType getClassType();
    static class_struct* getExportStruct();
    virtual void getFeature(Feature* feature);
    static void onClone(NodeBuffer& current, const NodeBuffer& from);

private:
    int mLength;
    char* mData;
};

#endif /* defined(__v8__NodeBuffer__) */
