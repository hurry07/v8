/*
 * WrapBase.h
 *
 *  Created on: 2013-8-12
 *      Author: jie
 */

#ifndef WRAPBASE_H_
#define WRAPBASE_H_

#include <v8.h>

using namespace v8;

class WrapBase {
public:
	WrapBase();
	virtual ~WrapBase();
	virtual void release();

    template<typename T>
    static T* selfPtr(const FunctionCallbackInfo<Value>& info) {
        Local<Object> self = info.Holder();
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }
    
    template<typename T>
    static void releaseFn(const FunctionCallbackInfo<Value>& info) {
        T* current = selfPtr<T>(info);
        if(!current->mRelease) {
            current->release();
            current->mRelease = true;
        }
    }

    template<typename T>
    static void getRelease(Local<String> property, const PropertyCallbackInfo<Value>& info) {
        info.GetReturnValue().Set(FunctionTemplate::New(releaseFn<T>)->GetFunction());
    }

protected:
	bool mRelease;
};

#endif /* WRAPBASE_H_ */
