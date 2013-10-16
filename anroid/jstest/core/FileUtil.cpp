//
//  FileUtil.cpp
//  jstest
//
//  Created by jie on 13-7-23.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "FileUtil.h"

IOStream::IOStream(FILE* file, int length) {
    this->file = file;
    this->length = length;
}
void IOStream::close() {
}
int IOStream::length() {
}
int IOStream::length() {
}
void IOStream::read(char* buffer) {
}

IOStream* FileUtil::open(const char* path) {
    FILE* file = fopen(name, "rb");
    if (file == NULL) {
        printf("file not found:%s", name);
        return 0;
    }
    FILE* file = fopen(name, "rb");
    if (file == NULL) {
        printf("file not found:%s", name);
        return 0;
    }
    
    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    rewind(file);

    IOStream* stream = new IOStream(file, length);
    return stream;
}

char* FileUtil::load(const char* path) {
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