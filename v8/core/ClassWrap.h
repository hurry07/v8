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
#include "sturctures.h"
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
    static void release(const FunctionCallbackInfo<Value>& info) {
        internalPtr<T>(info)->jsRelease();
    }
    /**
     * when js release the last refer of this object
     */
	static void unrefCallback(Isolate* isolate, Persistent<External>* value, T* parameter) {
        parameter->jsRelease();
		delete parameter;
		value->Dispose();
	}

	static void initFunction() {
		HandleScope scope(node_isolate);

        class_struct* clz = T::getExportStruct();
		Handle<FunctionTemplate> fn = FunctionTemplate::New(constructorCallback);
        
		fn->SetClassName(String::New(clz->mClassName));

        Local<ObjectTemplate> fnproto = fn->PrototypeTemplate();
        EXPOSE_METHOD(fnproto, release, ReadOnly | DontDelete);
        fnproto->SetInternalFieldCount(1);

        Local<ObjectTemplate> fninst = fn->InstanceTemplate();
		fninst->SetInternalFieldCount(1);

        if(clz->initClass !=0) {clz->initClass();};
        if(clz->initPrototype !=0) {clz->initPrototype(fnproto);};
        if(clz->initInstance !=0) {clz->initInstance(fninst);};

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
        class_struct* clz = T::getExportStruct();
        env->Set(String::New(clz->mClassName), getFunction());
    }
    static Handle<Object> newInstance() {
		HandleScope scope(node_isolate);
        return scope.Close(getFunction()->NewInstance());
    }
};

template<typename T>
Persistent<FunctionTemplate> ClassWrap<T>::_function;

template<typename T>
bool ClassWrap<T>::mInit = false;

#define NEW_INSTANCE(name, type, ...) Handle<Object> name;\
{\
    Handle<Object> __##name = ClassWrap<type>::newInstance();\
    type* self = internalPtr<type>(__##name);\
    self->init(__VA_ARGS__);\
    name = __##name;\
}

#endif /* JSWRAP_H_ */
