//
//  Image.cpp
//  v8
//
//  Created by jie on 13-9-1.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "Image.h"
#include "../core/v8Utils.h"
#include "../classes/file.h"

using namespace v8;

Image::Image() {
}
Image::~Image() {
    release();
}
void Image::doRelease() {
    delete mImage;
}
void Image::init(const v8::FunctionCallbackInfo<v8::Value> &args) {
    if(args.Length() == 0) {
        return;
    }
    if(args[0]->IsString()) {
        JSFile* file = JSFile::loadAsset(*String::Utf8Value(args[0]->ToString()));
        mImage = new node::CCImage();
        mImage->initWithImageData((void*)file->chars(), file->size());
        mRelease = false;
        delete file;
    }
}

void getWidth(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    Image* img = internalPtr<Image>(info, CLASS_IMAGE);
    if(img == 0 || img->isReleased()) {
        return;
    }
    return info.GetReturnValue().Set(img->mImage->getWidth());
}
void getHeight(Local<String> property, const PropertyCallbackInfo<Value>& info) {
    Image* img = internalPtr<Image>(info, CLASS_IMAGE);
    if(img == 0 || img->isReleased()) {
        return;
    }
    return info.GetReturnValue().Set(img->mImage->getHeight());
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    obj->SetAccessor(String::New("width"), getWidth);
    obj->SetAccessor(String::New("height"), getHeight);
    
    return scope.Close(temp->GetFunction());
}

class_struct* Image::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "image", CLASS_IMAGE
    };
    return &mTemplate;
}
ClassType Image::getClassType() {
     return getExportStruct()->mType;
}
