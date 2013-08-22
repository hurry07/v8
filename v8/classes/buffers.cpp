//
//  buffers.cpp
//  v8
//
//  Created by jie on 13-8-20.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "buffers.h"


NodeBufferView::NodeBufferView() : mBuffer(0), mByteOffset(0), mByteLength(0) {
}
NodeBufferView::~NodeBufferView() {
}
char* NodeBufferView::value_ptr() {
    return mBuffer->mData + mByteOffset;
}
