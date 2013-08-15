/*
 * Point.h
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#ifndef POINT_H_
#define POINT_H_

#include "../core/ClassBase.h"

class Point : public ClassBase {
public:
	Point();
    virtual ~Point();

    virtual void init(const FunctionCallbackInfo<Value> &args);
    virtual void init(float x, float y);

    static class_struct* getExportStruct();
    virtual ClassType getClassType();

    float x;
    float y;
};

#endif /* POINT_H_ */
