/*
 * Point.cpp
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#include "Point.h"
#include "../global.h"

template<> const char* ClassBase<Point>::mName = "Point";
template<> const ClassType ClassBase<Point>::mClassType = CLASS_POINT;

Point::Point() : x(0), y(0) {
	LOGI("init poin");
}
Point::~Point() {
    LOGI("release poin:%f, %f", x, y);
}
void Point::init(const FunctionCallbackInfo<v8::Value> &args) {
    if(args.Length() == 2) {
        this->x = args[0]->ToNumber()->Value();
        this->y = args[1]->ToNumber()->Value();
    }
}
void Point::release() {
    LOGI("call release");
}
