//
//  TextureAtlas.cpp
//  v8
//
//  Created by jie on 13-9-24.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "TextureAtlas.h"
#include "../utils/AssetUtil.h"
#include "../core/v8Utils.h"

static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;
    
    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
//    EXPOSE_METHOD(obj, loadAsset, ReadOnly | DontDelete);
//    EXPOSE_METHOD(obj, getContent, ReadOnly | DontDelete);
    
    return scope.Close(temp->GetFunction());
}

TextureAtlas::TextureAtlas() {
}
TextureAtlas::~TextureAtlas() {
    release();
}

class_struct* TextureAtlas::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "atlas", CLASS_Atlas
    };
    return &mTemplate;
}
ClassType TextureAtlas::getClassType() {
    return getExportStruct()->mType;
}
void TextureAtlas::doRelease() {
    texture_atlas_delete(atlas);
}
void TextureAtlas::init(const FunctionCallbackInfo<Value> &args) {
    int width = args[0]->Uint32Value();
    int height = args[1]->Uint32Value();
    int depth = args[2]->Uint32Value();
    atlas = texture_atlas_new(width, height, depth);
}
