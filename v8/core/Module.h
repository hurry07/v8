//
//  Module.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_Module_h
#define v8_Module_h

#include "../app/node.h"
#include <v8.h>

template<class T>
class Module {
public:
    static node::node_module_struct* getModule() {
        if(!mInit) {
        	mModule.version = NODE_MODULE_VERSION;
        	mModule.dso_handle = NULL;
        	mModule.filename = T::mFile;
        	mModule.register_func = T::init;
        	mModule.modname = T::mName;

            mInit = true;
        }
        return &mModule;
    }

    static void init(const v8::FunctionCallbackInfo<v8::Value>& args) {
    }

private:
    static bool mInit;
    static node::node_module_struct mModule;

public:
    static const char* mName;
    static const char* mFile;
};

template<class T>
bool Module<T>::mInit = false;
template<class T>
node::node_module_struct Module<T>::mModule;

#endif
