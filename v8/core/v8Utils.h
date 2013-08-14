//
//  v8Utils.h
//  v8
//
//  Created by jie on 13-8-14.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef v8_v8Utils_h
#define v8_v8Utils_h

template<typename T>
static T* selfPtr(const FunctionCallbackInfo<Value>& info) {
    Local<Object> self = info.Holder();
    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
    return static_cast<T*>(wrap->Value());
}

#endif
