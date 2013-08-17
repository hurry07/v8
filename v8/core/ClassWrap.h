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
	static Persistent<Function> _function;// create function
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
		HandleScope scope(node_isolate);
        internalPtr<T>(info)->release();
    }
    static void init(const FunctionCallbackInfo<Value>& info) {
		HandleScope scope(node_isolate);
        internalPtr<T>(info)->init(info);
    }
    static void toString(const FunctionCallbackInfo<Value>& info) {
		HandleScope scope(node_isolate);
        info.GetReturnValue().Set(String::New(internalPtr<T>(info)->toString()));
    }

    /**
     * create a copy of current js object
     */
    static void clone(const FunctionCallbackInfo<Value>& info) {
		HandleScope scope(node_isolate);

        if(info.Length() == 0) {
            T* t1 = internalPtr<T>(info);
            Local<Object> other = Local<Function>::New(node_isolate, _function)->NewInstance();
            T* t2 = internalPtr<T>(other);

            *t2 = *t1;
            T::onClone(*t2, *t1);

            info.GetReturnValue().Set(other);
        } else {
            T* t1 = internalPtr<T>(info);// this
            T* t2 = internalArg<T>(info[0]);

            *t1 = *t2;
            T::onClone(*t1, *t2);
        }
    }
    /**
     * when js release the last refer of this object
     */
	static void unrefCallback(Isolate* isolate, Persistent<External>* value, T* parameter) {
        parameter->release();
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
        EXPOSE_METHOD(fnproto, init, ReadOnly | DontDelete);
        EXPOSE_METHOD(fnproto, toString, ReadOnly | DontDelete);
        EXPOSE_METHOD(fnproto, clone, ReadOnly | DontDelete);
        fnproto->SetInternalFieldCount(1);

        Local<ObjectTemplate> fninst = fn->InstanceTemplate();
		fninst->SetInternalFieldCount(1);

        if(clz->initFn !=0) {
            Local<Function> exportFn = clz->initFn(fn);
            _function.Reset(node_isolate, exportFn);
        } else {
            _function.Reset(node_isolate, fn->GetFunction());
        }
	}

	static Local<Function> getFunction() {
        if(!mInit) {
            initFunction();
            mInit = true;
        }
		return Local<Function>::New(node_isolate, _function);
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
Persistent<Function> ClassWrap<T>::_function;

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
