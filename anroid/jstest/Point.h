//
//  Point.h
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __jstest__Point__
#define __jstest__Point__

#include <iostream>
#include "include/v8.h"

class Point
{
public:
    Point()
    {
        x_ = 0;
        y_ = 0;
        printf("%s\n", "Point()");
    }
    Point(int x, int y)
    {
        x_ = x;
        y_ = y;
        printf("%s\n", "Point()");
    }
    ~Point() {
        printf("%s\n", "~Point()");
    }

    int getX() const {return x_;}
    int getY() const {return y_;}
    void setX(int value) { x_ = value; }
    void setY(int value) { y_ = value; }
    bool isNull() const {
        return x_ == 0 && y_ == 0;
    }
    void show()
    {
        printf("x,y = %d,%d\n", x_, y_);
    }
    int x_, y_;
    
    static void CreateObjectToJs(v8::Handle<v8::Context>& pObj);
};

#endif /* defined(__jstest__Point__) */
