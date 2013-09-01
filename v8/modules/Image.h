//
//  Image.h
//  v8
//
//  Created by jie on 13-9-1.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Image__
#define __v8__Image__

#include "../core/ClassBase.h"
#include "CCImage.h"
#include <v8.h>

class Image : public ClassBase {
public:
    Image();
    virtual ~Image();

    virtual void init(const v8::FunctionCallbackInfo<v8::Value> &args);
    virtual void doRelease();
    static class_struct* getExportStruct();
    virtual ClassType getClassType();

    node::CCImage* mImage;
};

#endif /* defined(__v8__Image__) */
