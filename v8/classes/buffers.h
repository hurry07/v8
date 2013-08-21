//
//  buffers.h
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__buffers__
#define __v8__buffers__

#include "arraybuffer.h"
#include "../core/ClassBase.h"

class NodeBufferView : public ClassBase {
public:
    NodeBufferView();
    virtual ~NodeBufferView();

    NodeBuffer* mBuffer;
    long mByteOffset;
    long mByteLength;

    virtual char* value_ptr();
};

#endif /* defined(__v8__buffers__) */
