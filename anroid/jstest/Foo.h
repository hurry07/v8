//
//  Foo.h
//  jstest
//
//  Created by jie on 13-7-23.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __jstest__Foo__
#define __jstest__Foo__

#include <iostream>
#include "include/v8.h"

using namespace v8;

class Foo
{
public:
	static int total;
	static int number;
	static int last;
    
	Foo();
	~Foo();
};

int Foo::total  = 1;
int Foo::number = 1;
int Foo::last = 1;

Foo::Foo()
{
	if (last > number) {
		printf("creating from id %d\n", number);
	}
	last = number;
	++number;
	++total;
	// 加上下面这条似乎更合理，不过对于没有成员变量的类来说有没有都无感觉。
	// 2011-08-13 补充，使用sizeof(Foo) 1字节，并不正确，详见文尾补充
	V8::AdjustAmountOfExternalAllocatedMemory(sizeof(Foo));
}

Foo::~Foo()
{
	if (last<number) {
		printf("sweeping from id %d\n", number);
	}
	last = number;
	--number;
	V8::AdjustAmountOfExternalAllocatedMemory(-sizeof(Foo));
}

long long microtime()
{
    return 0;
}

//void fooCallBack(Isolate* isolate, Persistent<Value>* value, Point* parameter)
//{
//    printf("release");
//    delete parameter;
//}
//
//int main(int argc, char *argv[])
//{
//	V8::SetFlagsFromCommandLine(&argc, argv, true);
//
//	HandleScope scope;
//	Local<Context> context = Context::New(Isolate::GetCurrent());
//	Context::Scope context_scope(context);
//
//	auto object_template = ObjectTemplate::New();
//	object_template->SetInternalFieldCount(1);
//
//	auto start = microtime();
//	int times = 2e8;
//	for (int i=0; i<times; ++i) {
//		HandleScope scope;
//		Local<Object> object = object_template->NewInstance();
//		Foo* foo = new Foo();
//
//		// 把foo可入到object，使得在任何时候都可能通过对象object得到foo的指针。
//		// 这句也可简写成object->SetPointerInInternalField(0, foo);
//		object->SetInternalField(0, External::New(foo));
//
//		// 创建一个Persistent句柄监视object的引用状况，
//		// 当object不被任何对象引用时，删除foo与该句柄。
//		Persistent<Object>::New(object).MakeWeak(foo, [](Persistent<Value> value, void *data) {
//			delete (Foo*)data;
//			value.Dispose();
//		});
//		if (i%(int)1e6 == 0) {
//			int speed = i / (microtime() - start);
//			printf("Speed: %d\n", speed);
//		}
//	}
//
//
////	context.Dispose();
//	return 0;
//}

#endif /* defined(__jstest__Foo__) */
