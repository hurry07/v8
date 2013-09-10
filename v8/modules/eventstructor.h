//
//  eventstructor.h
//  v8
//
//  Created by jie on 13-9-10.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__eventstructor__
#define __v8__eventstructor__

#include "../core/ClassBase.h"

class EventStructor;

/**
 * hold a tempary read/write range
 */
class DataRange {
public:
    DataRange(EventStructor* eStruct, char type);
    ~DataRange();

    int mStart;
    int mEnd;
    char mType;
    EventStructor* mStructor;
    virtual void clear();

    /**
     * init range
     */
    virtual void start(int start, int end);
    /**
     * read a structor unit and return structors remain
     */
    virtual int read(char* dest);
    /**
     * write a structor unit and return empty slot remain
     */
    virtual int write(char* dest);
    /**
     * finish read and tell the underlying EventStructor how much data was readed or written
     */
    virtual void end();
};

class EventStructor : public ClassBase {
public:
    EventStructor(int stride, int count);
    virtual ~EventStructor();
    virtual void read(char* dest, int index);
    virtual void write(char* src, int index);

    virtual DataRange* startRead();
    virtual DataRange* startWrite();
    virtual void endRange(DataRange* range);
    /**
     * reset all bytes, make it maxmum writable
     */
    virtual void clear();

protected:
    int mRead;
    int mWrite;
    int mCount;
    int mStride;
    char* mBuffer;
    char* value_ptr(int index);

    DataRange* mReadRange;
    DataRange* mWriteRange;
};

#endif /* defined(__v8__eventstructor__) */
