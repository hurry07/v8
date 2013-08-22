//
//  bytebuffer.h
//  v8
//
//  Created by jie on 13-8-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__bytebuffer__
#define __v8__bytebuffer__

#include "classenum.h"

class NodeBuffer;
class NodeBufferView;

/**
 * used as a bridge when sequence/unsequence of classes
 */
class ByteBuffer {
public:
    char* mPtr;
    long mByteOffset;
    long mByteLength;
    int mElementSize;
    ClassType mElement;
    
    ByteBuffer();
    
    void init(char* ptr, int length, ClassType type);
    void init(NodeBufferView* view, ClassType type);
    void init(NodeBufferView* view, ClassType type, int elementSize);
    
    void init(NodeBuffer* buf);
    void init(NodeBuffer* buf, ClassType type);
    void init(NodeBuffer* buf, long bOffset, long bLength, ClassType type);
    void init(NodeBuffer* buf, long bOffset, long bLength, ClassType type, int typeUnit);
    
    static int getTypeSize(ClassType type);

    template<typename T>
    T* value_ptr(int index=0);

    char* value_ptr();
    long length();
    int typedLength();
};

template<typename T>
T* ByteBuffer::value_ptr(int index) {
    return (T*)(mPtr + mByteOffset) + index;
}

#endif /* defined(__v8__bytebuffer__) */
