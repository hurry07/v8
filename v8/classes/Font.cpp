//
//  Font.cpp
//  v8
//
//  Created by jie on 13-9-24.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "Font.h"
#include "TextureAtlas.h"
#include "../utils/AssetUtil.h"
#include "../core/v8Utils.h"

METHOD_BEGIN(loadAsset, info) {
    //    HandleScope scope;
    //
    //    JSFile* file = internalPtr<JSFile>(info);
    //    file->release();
    //    AssetUtil::load(file, *String::Utf8Value(info[0]->ToString()));
}
METHOD_BEGIN(getContent, info) {
    //    HandleScope scope;
    //
    //    JSFile* file = internalPtr<JSFile>(info);
    //    if(file->isReleased()) {
    //        info.GetReturnValue().Set(String::New(""));
    //    } else {
    //        info.GetReturnValue().Set(String::New(file->chars(), file->size()));
    //    }
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, loadAsset, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, getContent, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}

Font::Font() {
}
Font::~Font() {
    release();
}

class_struct* Font::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "font", CLASS_Font
    };
    return &mTemplate;
}
ClassType Font::getClassType() {
    return getExportStruct()->mType;
}
void Font::doRelease() {
}
void Font::init(const FunctionCallbackInfo<Value> &args) {
//    TextureAtlas* atlas = internalArg<TextureAtlas>(args[0]);
//    wchar_t* file =  (wchar_t*)(*String::Utf8Value(args[1]->ToString()));
//    LOGI("--->init:%ls", file);
    String::Utf8Value fvalue(args[1]->ToString());
    char* file =  *fvalue;
//    wchar_t* wfile = (wchar_t*)(*fvalue);
    wchar_t* wfile = L"北京";
    LOGI("--->init:%s %ls %d", file, wfile, fvalue.length());
}
