//
//  Point.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "Point.h"
#include "include/v8.h"

using namespace v8;

Handle<Value> GetPointX(Local<String> key,const AccessorInfo &info)
{
    Handle<Object> obj = info.This ();
    //Local<Object> self = info.Holder(); //使用此种方法会死!!!-
    Point& point = *static_cast<Point*> (Local<External>::Cast(obj->GetInternalField(0))->Value ());
    int value = point.x_;
    return Integer::New(value);
}

void SetPointX(Local<String> key, Local<Value> value,const AccessorInfo& info)
{
    Handle<Object> obj = info.This ();
    Point& point = *static_cast<Point*> (Local<External>::Cast(obj->GetInternalField(0))->Value ());
    point.x_ = value->Int32Value();
}

Handle<Value> GetPointY(Local<String> key,const AccessorInfo &info)
{
    Local<Object> self = info.Holder();
    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
    void* ptr = wrap->Value();
    int value = static_cast<Point*>(ptr)->y_;
    return Integer::New(value);
}

void SetPointY(Local<String> key, Local<Value> value,const AccessorInfo& info)
{
    Local<Object> self = info.Holder();
    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
    void* ptr = wrap->Value();
    static_cast<Point*>(ptr)->y_ = value->Int32Value();
}

Handle<Value> ShowPoint(const Arguments& args)
{
    Local<Object> self = args.Holder();
    //Local<Object> self = info.Holder();
    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
    void* ptr = wrap->Value();
    static_cast<Point*>(ptr)->show();
    
    return Undefined();
}

Point* NewPointFunction(const Arguments & args)
{
    if(args.Length()==2)
    {
        Local<Value> v1 = args[0];
        Local<Value> v2 = args[1];
        
//        return new Point(v1->Int32Value(), v2->Int32Value());
        return new Point(1, 2);
    } else {
        return new Point();
    }
}

void PointWeakExternalReferenceCallback(Isolate* isolate, Persistent<Value>* value, Point* parameter)
{
    printf("release");
    delete parameter;
    value->Dispose();
}

Handle<Value> PointFunctionInvocationCallback(const Arguments &args)
{
    HandleScope scope;

    if (!args.IsConstructCall())
        return Undefined();
    
//    Point* cpp_object = NewPointFunction(args);
    Point* cpp_object = new Point(1, 0);
    if (!cpp_object) {
        return ThrowException(String::New("Can not create Object in C++"));
    }

//    Local<External> pref = External::New(cpp_object);
    Persistent<External> ret(Isolate::GetCurrent(), External::New(cpp_object));
//    Persistent<External> ret;
    ret.MakeWeak<v8::Value>(cpp_object, PointWeakExternalReferenceCallback);
    args.Holder()->SetInternalField(0, External::New(cpp_object));

    return Undefined();
}

void Point::CreateObjectToJs(Handle<Context>& pObj)
{
    Handle<FunctionTemplate> point_templ = FunctionTemplate::New(PointFunctionInvocationCallback);
    point_templ->InstanceTemplate();
    point_templ->SetClassName(String::New("Point"));
    point_templ->InstanceTemplate()->SetInternalFieldCount(1);

//    Handle<ObjectTemplate> point_proto = point_templ->PrototypeTemplate();
//    point_proto->SetAccessor(String::New("x"), GetPointX, SetPointX);
//    point_proto->SetAccessor(String::New("y"), GetPointY, SetPointY);
//    point_proto->Set(String::New("show"), FunctionTemplate::New(ShowPoint));

    pObj->Global()->Set(String::New("Point"), point_templ->GetFunction());
}

