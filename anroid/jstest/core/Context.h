//
//  Context.h
//  jstest
//
//  Created by jie on 13-7-23.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __jstest__Context__
#define __jstest__Context__

#include <iostream>
#include "../include/v8.h"

class JSContext {
public:
    JSContext();
    ~JSContext();

    void runScript(const char* path);
    void gc();
    const char* getName();

private:
    char* name;
    Context context;// jscontext
}

#endif /* defined(__jstest__Context__) */
