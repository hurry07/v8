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

class DataRange;

class EventStructor : public ClassBase {
public:
    /**
     * @param stride element size in bytes
     * @param count element count
     */
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
    char* value_ptr(int index);

protected:
    int mRead;
    int mWrite;
    int mCount;
    int mStride;
    char* mBuffer;

    DataRange* mReadRange;
    DataRange* mWriteRange;
};

/**
 * hold a tempary read/write range
 */
class DataRange {
public:
    DataRange(EventStructor* eStruct, char type);
    virtual ~DataRange();

    int mStart;
    int mEnd;
    char mType;
    EventStructor* mStructor;
    virtual void clear();

    template <typename T>
    T* value_ptr() {
        if(mStart == mEnd) {
            return 0;
        }
        return (T*)(mStructor->value_ptr(mStart));
    }

    virtual bool isEmpty();
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
    /**
     * increase the cursor
     */
    virtual void next();
};

#endif /* defined(__v8__eventstructor__) */
