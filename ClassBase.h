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
#include "../classes/classenum.h"
#include "sturctures.h"

using namespace v8;

class ClassBase {
public:
	ClassBase();
    /*
     * release other
     */
	virtual ~ClassBase();

    /**
     * instance should release resource in this method
     */
	virtual void release();
    virtual void jsRelease();
    virtual void init(const FunctionCallbackInfo<Value> &args);

    virtual ClassType getClassType();
    static class_struct* getExportStruct();

protected:
	bool mRelease;// has release called on current instance
};

#endif /* ClassBase_H_ */
