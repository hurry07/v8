/*
 * Point.cpp
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#include "Point.h"
#include "../global.h"

Point::Point() : x(0), y(0) {
	LOGI("init poin\n");
}
Point::~Point() {
    LOGI("release poin:%f, %f\n", x, y);
}
void Point::init(const FunctionCallbackInfo<v8::Value> &args) {
//    if(args.Length() == 2) {
//        this->x = args[0]->ToNumber()->Value();
//        this->y = args[1]->ToNumber()->Value();
//    }
}
WRAP_BRIDGE_EMPTY(Point);
void Point::release() {
    LOGI("call release");
}