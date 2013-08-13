/*
 * WrapBase.h
 *
 *  Created on: 2013-8-12
 *      Author: jie
 */

#ifndef WRAPBASE_H_
#define WRAPBASE_H_

#include <v8.h>

using v8::FunctionCallbackInfo;
using v8::Value;
using v8::AccessorInfo;
using v8::Local;
using v8::Object;
using v8::External;

class WrapBase {
public:
	WrapBase();
	virtual ~WrapBase();
	virtual void release();

    template<typename T>
    static T* selfPtr(const AccessorInfo& info) {
        Local<Object> self = info.Holder();
        Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
        return static_cast<T*>(wrap->Value());
    }

protected:
	bool mRelease;
	static void jsRelease(const FunctionCallbackInfo<Value> &args);
};

#endif /* WRAPBASE_H_ */
