/*
 * WrapBase.h
 *
 *  Created on: 2013-8-12
 *      Author: jie
 */

#ifndef WRAPBASE_H_
#define WRAPBASE_H_

#include <v8.h>
#include <string>

using namespace v8;

class WrapBase {
public:
	WrapBase();
	virtual ~WrapBase();
	virtual void release();
    virtual void jsRelease();

    template<typename T>
    static const char* getClassName() {
        return std::string(T::mName).c_str();
    }
    static void initPrototype(Local<ObjectTemplate>& obj) {
    }
    static void initInstance(Local<ObjectTemplate>& obj) {
    }
    /**
     * init cpp class instance
     */
    virtual void init(const FunctionCallbackInfo<Value> &args);
    /**
     * init class properties bindings when first export
     */
    static void initClass();

protected:
	bool mRelease;
    static const char* mName;// cpp export name
};

#endif /* WRAPBASE_H_ */
