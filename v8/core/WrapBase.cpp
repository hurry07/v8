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
void WrapBase::release() {
	LOGI("WrapBase::release");
}
