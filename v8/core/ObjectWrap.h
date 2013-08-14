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
class ObjectWrap {
public:
	static Persistent<FunctionTemplate> _function;// create function
	static Persistent<Function> _release;// release function
    static bool _init;

	static void releaseCallback(Isolate* isolate, Persistent<External>* value, T* parameter) {
		LOGI("~release\n");
		delete parameter;
		value->Dispose();
	}

	static void constructorCallback(const FunctionCallbackInfo<Value> &args) {
		HandleScope scope(node_isolate);
		if (!args.IsConstructCall()) {
			return;
		}

		T* instance = new T();
		instance->init(args);

		Persistent<External> ret(Isolate::GetCurrent(), External::New(instance));
		ret.MakeWeak(node_isolate, instance, releaseCallback);

		args.This()->SetInternalField(0, External::New(instance));
	}
    static void releaseFn(const FunctionCallbackInfo<Value>& info) {
        T* current = selfPtr<T>(info);
        current->jsRelease();
    }
    static void getRelease(Local<String> property, const PropertyCallbackInfo<Value>& info) {
        info.GetReturnValue().Set(Local<Function>::New(node_isolate, _release));
    }

	static void initFunction() {
		HandleScope scope(node_isolate);
        
		_release.Reset(node_isolate, FunctionTemplate::New(releaseFn)->GetFunction());// save release function to persistence field
        
		Handle<FunctionTemplate> fn = FunctionTemplate::New(constructorCallback);
		fn->SetClassName(String::New(T::template getClassName<T>()));

        Local<ObjectTemplate> fnproto = fn->PrototypeTemplate();
        fnproto->SetAccessor(String::New("release"), getRelease);// add default release func
        Local<ObjectTemplate> fninst = fn->InstanceTemplate();
        
		fninst->SetInternalFieldCount(1);

        T::initClass();
        T::initPrototype(fnproto);
        T::initInstance(fninst);

		_function.Reset(node_isolate, fn);
	}

	static Local<Function> getFunction() {
        if(!_init) {
            initFunction();
            _init = true;
        }
		return Local<FunctionTemplate>::New(node_isolate, _function)->GetFunction();
	}
    
    static void expose(Local<Object> env) {
        env->Set(String::New(T::template getClassName<T>()), getFunction());
    }
};

template<typename T>
Persistent<FunctionTemplate> ObjectWrap<T>::_function;

template<typename T>
Persistent<Function> ObjectWrap<T>::_release;

template<typename T>
bool ObjectWrap<T>::_init = false;

#endif /* JSWRAP_H_ */
