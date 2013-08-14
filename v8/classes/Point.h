/*
 * Point.h
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#ifndef POINT_H_
#define POINT_H_

#include "../core/ClassBase.h"

class Point : public ClassBase<Point> {
public:
	Point();
	virtual ~Point();
    virtual void release();
    virtual void init(const FunctionCallbackInfo<Value> &args);

private:
    float x;
    float y;
};

#endif /* POINT_H_ */
