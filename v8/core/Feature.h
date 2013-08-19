//
//  Feature.h
//  v8
//
//  Created by jie on 13-8-19.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__Feature__
#define __v8__Feature__

#include "../classes/classenum.h"

class Feature {
public:
    FeatureType mType;
    Feature() : mType(FEATURE_NULL) {
    }
};

template <typename T>
class FeaturePtr : public Feature {
public:
    T* mPtr;
    int mSize;

    FeaturePtr() : mPtr(0), mSize(0) {
        mType = FEATURE_PTR;
    }
};

#endif /* defined(__v8__Feature__) */
