//
//  modules.h
//  v8
//
//  Created by jie on 13-8-4.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_modules_h
#define v8_modules_h

#include "Console.h"
#include "GLBinding.h"
#include "../app/node.h"

namespace node {
    
    node_module_struct *node_module_list[] = {
        &Console::_Module,
        &GLBinding::_Module,
        NULL};
    
    struct node_module_struct* get_builtin_module(const char *name) {
        char buf[128];
        node_module_struct *cur = NULL;
        snprintf(buf, sizeof(buf), "node_%s", name);
        
        /* TODO: you could look these up in a hash, but there are only a few, and once loaded they are cached. */
        for (int i = 0; node_module_list[i] != NULL; i++) {
            cur = node_module_list[i];
            if (strcmp(cur->modname, buf) == 0) {
                return cur;
            }
        }
        return NULL;
    }
}

#endif
