//
//  main.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include <iostream>
#include <string>
#include "include/v8.h"
#include "Point.h"

using namespace v8;

//void Run(LPCSTR lpszCode)
//{
//    v8::HandleScope handle_scope;
//    
//    // Create a template for the global object.
//    v8::Handle<v8::ObjectTemplate> global = v8::ObjectTemplate::New();
//    // Bind the global 'print' function to the C++ Print callback.
//    global->Set(v8::String::New("print"), v8::FunctionTemplate::New(Print));
//    // Create a new execution environment containing the built-in
//    // functions
//    v8::Persistent<v8::Context> context = v8::Context::New(NULL, global);
//    {
//        // Enter the newly created execution environment.
//        v8::Context::Scope context_scope(context);
//        v8::Handle<v8::String> file_name = v8::String::New("unnamed");
//        v8::Handle<v8::String> source = v8::String::New(lpszCode);
//        v8::Handle<v8::Script> script = v8::Script::Compile(lpszCode, name);
//    }
//}

// The callback that is invoked by v8 whenever the JavaScript 'print'
// function is called. Prints its arguments on stdout separated by
// spaces and ending with a newline.
v8::Handle<v8::Value> Print(const v8::Arguments& args) {
    int length = args.Length();
    if(length > 0) {
        v8::String::Utf8Value str(args[0]);
        printf("%s", *str);
    }
    for (int i = 1; i < length; i++) {
        v8::HandleScope handle_scope;
        printf(",");
        v8::String::Utf8Value str(args[i]);
        printf("%s", *str);
    }
    printf("\n");
    return v8::Undefined();
}

v8::Handle<v8::String> ReadFile(const char* name) {
    FILE* file = fopen(name, "rb");
    if (file == NULL) {
        printf("file not found:%s", name);
        return v8::Handle<v8::String>();
    }
    
    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    rewind(file);
    
    char* chars = new char[size + 1];
    chars[size] = '\0';
    
    for (int i = 0; i < size;) {
        int read = fread(&chars[i], 1, size - i, file); 
        i += read; 
    }

    fclose(file);
    
    v8::Handle<v8::String> result = v8::String::New(chars, size);
    delete[] chars;
    
    name = std::string("hello").c_str();
    return result;
}

void runScript(Handle<v8::String> source) {
    Handle<Script> script = Script::Compile(source);
    Handle<Value> result = script->Run();
    if(!result.IsEmpty() && result != v8::Undefined()) {
        String::AsciiValue ascii(result);
        printf("%s\n", *ascii);
    }
}

void initContext(Handle<v8::Context> context) {
    Handle<ObjectTemplate> objtemp = ObjectTemplate::New();
    objtemp->Set("log", v8::FunctionTemplate::New(Print));

    context->Global()->Set(v8::String::New("console"), objtemp->NewInstance());
}

//void bindPoint(Handle<v8::Context> context) {
//    Handle<ObjectTemplate> point_templ = ObjectTemplate::New();
//    point_templ->SetInternalFieldCount(1);
//    point_templ->SetAccessor(String::New("x"), GetPointX, SetPointX);
//    point_templ->SetAccessor(String::New("y"), GetPointY, SetPointY);
//}
//
//Handle<Value> GetPointX(Local<String> property,
//                        const AccessorInfo &info) {
//    Local<Object> self = info.Holder();
//    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
//    void* ptr = wrap->Value();
//    int value = static_cast<Point*>(ptr)->x_;
//    return Integer::New(value);
//}
//
//void SetPointX(Local<String> property, Local<Value> value,
//               const AccessorInfo& info) {
//    Local<Object> self = info.Holder();
//    Local<External> wrap = Local<External>::Cast(self->GetInternalField(0));
//    void* ptr = wrap->Value();
//    static_cast<Point*>(ptr)->x_ = value->Int32Value();
//}

Handle<ObjectTemplate> createTemplate() {
    Handle<ObjectTemplate> objtemp = ObjectTemplate::New();
    objtemp->Set("log", v8::FunctionTemplate::New(Print));
    return objtemp;
}

int main(int argc, const char * argv[])
{
    HandleScope handle_scope;
    Local<Context> context = v8::Context::New(Isolate::GetCurrent());
    Context::Scope context_scope(context);
    
    initContext(context);
    Point::CreateObjectToJs(context);

    v8::Handle<v8::String> js = ReadFile("/Users/jie/git/v8js/test.js");
    runScript(js);

    char const* a = std::string("a").c_str();
    a = std::string("b").c_str();

    while (!v8::V8::IdleNotification());

    printf("done.");
    // insert code here...
    return 0;
}
