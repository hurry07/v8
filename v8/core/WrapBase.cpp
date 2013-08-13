/*
 * WrapBase.cpp
 *
 *  Created on: 2013-8-12
 *      Author: jie
 */
#include "WrapBase.h"
#include "../global.h"

using v8::External;
using v8::Local;
using v8::Object;

WrapBase::WrapBase() {
	mRelease = false;
}
WrapBase::~WrapBase() {
	if (!mRelease) {
		release();
	}
}
void WrapBase::jsRelease(const FunctionCallbackInfo<Value> &args) {
	Local<Object> self = args.This();
	Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
	WrapBase* ptr = static_cast<WrapBase*>(wrap->Value());
	if (!ptr->mRelease) {
		ptr->release();
		ptr->mRelease = true;
	}
}
void WrapBase::release() {
	LOGI("WrapBase::release");
}
