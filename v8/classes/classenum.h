//
//  classenum.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_classenum_h
#define v8_classenum_h

enum ClassType {
    CLASS_NULL = 0,
    CLASS_GLM,
    CLASS_POINT,
    CLASS_MATRIX2,
    CLASS_MATRIX3,
    CLASS_MATRIX4,
    CLASS_VEC2,
    CLASS_VEC3,
    CLASS_VEC4,
    CLASS_FILE
};

enum FeatureType {
    FEATURE_NULL,
    FEATURE_PTR
};

#endif
