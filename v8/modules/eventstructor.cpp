//
//  eventstructor.cpp
//  v8
//
//  Created by jie on 13-9-10.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "eventstructor.h"

DataRange::DataRange(EventStructor* eStruct, char type) {
    mStructor = eStruct;
    mType = type;
}
DataRange::~DataRange() {
}

void DataRange::start(int start, int end) {
    mStart = start;
    mEnd = end;
}
int DataRange::read(char* dest) {
    if(mStart == mEnd) {
        return -1;
    }
    mStructor->read(dest, mStart++);
    return mEnd - mStart;
}
int DataRange::write(char* src) {
    if(mStart == mEnd) {
        return -1;
    }
    mStructor->write(src, mStart++);
    return mEnd - mStart;
}
void DataRange::next() {
    mStart++;
}
void DataRange::end() {
    mStructor->endRange(this);
}
void DataRange::clear() {
    mStart = mEnd = 0;
}
bool DataRange::isEmpty() {
    return mStart == mEnd;
}

EventStructor::EventStructor(int stride, int count) {
    mStride = stride;
    mCount = count + 1;
    mBuffer = new char[mStride * mCount];
    mReadRange = new DataRange(this, 'r');
    mWriteRange = new DataRange(this, 'w');
}
EventStructor::~EventStructor() {
    delete[] mBuffer;
    delete mReadRange;
    delete mWriteRange;
}
void EventStructor::read(char* dest, int index) {
    memcpy(dest, value_ptr(index), mStride);
}
void EventStructor::write(char* src, int index) {
    memcpy(value_ptr(index), src, mStride);
}

DataRange* EventStructor::startRead() {
    mReadRange->start(mRead, mWrite < mRead ? mWrite + mCount : mWrite);
    return mReadRange;
}
DataRange* EventStructor::startWrite() {
    mWriteRange->start(mWrite, mRead <= mWrite ? mRead + mCount - 1 : mRead - 1);
    return mWriteRange;
}
void EventStructor::endRange(DataRange* range) {
    if(range->mType == 'r') {
        mRead = range->mStart;
    } else if(range->mType == 'w') {
        mWrite = range->mStart;
    }
}
void EventStructor::clear() {
    mRead = mWrite = 0;
}
char* EventStructor::value_ptr(int index) {
    return mBuffer + (index < mCount ? index : index - mCount) * mStride;
}
