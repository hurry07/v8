/*
 * ClassBase.h
 *
 *  Created on: 2013-8-12
 *      Author: jie
 */

#ifndef ClassBase_H_
#define ClassBase_H_

#include <v8.h>
#include <string>
#include "../global.h"

using namespace v8;

template<class T>
class ClassBase {
public:
	ClassBase() : mRelease(false) {
    }
	virtual ~ClassBase() {
    }
	virtual void release() {
        LOGI("ClassBase.release");
    }
    virtual void jsRelease() {
        if(!mRelease) {
            release();
            mRelease = true;
        }
    }

    /**
     * init cpp class instance
     */
    virtual void init(const FunctionCallbackInfo<Value> &args) {
    }
    static const char* getClassName() {
        return std::string(T::mName).c_str();
    }
    static void initPrototype(Local<ObjectTemplate>& obj) {
    }
    static void initInstance(Local<ObjectTemplate>& obj) {
    }
    /**
     * init class properties bindings when first export, you can init getter and setter functions
     */
    static void initClass() {
    }

protected:
	bool mRelease;// has release called on current instance
    static const char* mName;// cpp export name
};

#endif /* ClassBase_H_ */
