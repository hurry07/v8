/*
 * Point.h
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#ifndef POINT_H_
#define POINT_H_

#include "wrapmacros.h"
#include "WrapBase.h"

class Point : public WrapBase {
public:
	Point();
	virtual ~Point();
    virtual void release();
    virtual void init(const FunctionCallbackInfo<Value> &args);
    static const char* mName;

private:
    float x;
    float y;
};

#endif /* POINT_H_ */
