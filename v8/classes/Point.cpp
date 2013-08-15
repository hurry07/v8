/*
 * Point.cpp
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#include "Point.h"
#include "../global.h"

Point::Point() : x(0), y(0) {
}
Point::~Point() {
//    LOGI("delete point:%f %f", x, y);
}
void Point::init(const FunctionCallbackInfo<v8::Value> &args) {
    if(args.Length() == 2) {
        this->x = args[0]->ToNumber()->Value();
        this->y = args[1]->ToNumber()->Value();
    }
}
void Point::init(float x, float y) {
    this->x = x;
    this->y = y;
}
class_struct* Point::getExportStruct() {
    static class_struct mTemplate = {
        0, 0, 0, "Point", CLASS_POINT
    };
    return &mTemplate;
}
ClassType Point::getClassType() {
    return getExportStruct()->mType;
}
