/*
 * JSWrap.h
 *
 *  Created on: 2013-8-11
 *      Author: jie
 */

#ifndef JSWRAP_H_
#define JSWRAP_H_

#include <v8.h>
#include "node.h"
#include "v8Utils.h"
#include "../global.h"

using namespace v8;

/**
 * wrap cpp object to js class
 */
template<class T>
class ClassWrap {
public:
	static Persistent<FunctionTemplate> _function;// create function
    static bool mInit;

    /**
     * when js release the last refer of this object
     */
	static void unrefCallback(Isolate* isolate, Persistent<External>* value, T* parameter) {
		LOGI("~release\n");
		delete parameter;
		value->Dispose();
	}

    /**
     * constructor
     */
	static void constructorCallback(const FunctionCallbackInfo<Value> &args) {
		HandleScope scope(node_isolate);
		if (!args.IsConstructCall()) {
			return;
		}

		T* instance = new T();
		instance->init(args);

		Persistent<External> ret(Isolate::GetCurrent(), External::New(instance));
		ret.MakeWeak(node_isolate, instance, unrefCallback);

		args.This()->SetInternalField(0, External::New(instance));
	}

    /**
     * release will unbind native resource
     */
    static void releaseCallback(const FunctionCallbackInfo<Value>& info) {
        T* current = selfPtr<T>(info);
        current->jsRelease();
    }

	static void initFunction() {
		HandleScope scope(node_isolate);
        
		Handle<FunctionTemplate> fn = FunctionTemplate::New(constructorCallback);
		fn->SetClassName(String::New(T::getClassName()));

        Local<ObjectTemplate> fnproto = fn->PrototypeTemplate();
        fnproto->Set(String::New("release"), FunctionTemplate::New(releaseCallback)->GetFunction());// add default release func
        Local<ObjectTemplate> fninst = fn->InstanceTemplate();
        
		fninst->SetInternalFieldCount(1);

        T::initClass();
        T::initPrototype(fnproto);
        T::initInstance(fninst);

		_function.Reset(node_isolate, fn);
	}

	static Local<Function> getFunction() {
        if(!mInit) {
            initFunction();
            mInit = true;
        }
		return Local<FunctionTemplate>::New(node_isolate, _function)->GetFunction();
	}

    static void expose(Local<Object> env) {
        env->Set(String::New(T::getClassName()), getFunction());
    }
};

template<typename T>
Persistent<FunctionTemplate> ClassWrap<T>::_function;

template<typename T>
bool ClassWrap<T>::mInit = false;

#endif /* JSWRAP_H_ */
