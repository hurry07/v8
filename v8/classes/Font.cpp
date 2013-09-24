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

#include <ft2build.h>
#include FT_FREETYPE_H
#include FT_STROKER_H
// #include FT_ADVANCES_H
#include FT_LCD_FILTER_H
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <math.h>
#include <wchar.h>
#include "platform.h"
#include "texture-font.h"
#include "file.h"

METHOD_BEGIN(load, info) {
    HandleScope scope;

    Font* font = internalPtr<Font>(info, CLASS_Font);
    if(font == 0) {
        return;
    }
    String::Utf8Value text(info[0]->ToString());
    
    JSFile* file = JSFile::loadAsset(font->font->filename);
    js_texture_font_load_glyphs(font->font, (const wchar_t*)(*text), file->chars(), file->size());
    delete file;
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, load, ReadOnly | DontDelete);

    return scope.Close(temp->GetFunction());
}

Font::Font() : font(0) {
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
    texture_font_delete(font);
    font = 0;
}
void Font::init(const FunctionCallbackInfo<Value> &args) {
    TextureAtlas* atlas = internalArg<TextureAtlas>(args[0], CLASS_Atlas);
    String::Utf8Value path(args[1]->ToString());
    float depth = args[2]->NumberValue();

    JSFile* file = JSFile::loadAsset(*path);
    font = js_texture_font_new(atlas->atlas, *path, depth, file->chars(), file->size());
    delete file;

    mRelease = false;
}
