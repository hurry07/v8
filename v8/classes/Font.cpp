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

static FT_Error load_font_assets (FT_Library* library, const char* filename, FT_Long face_index, FT_Face* aface) {
    LOGI("load_font_assets:%s", filename);
    JSFile* file = JSFile::loadAsset(filename);
    FT_Error e = FT_New_Memory_Face(*library, (const FT_Byte*)file->chars(), file->size(), face_index, aface);
    delete file;

    return e;
}

METHOD_BEGIN(load, info) {
    HandleScope scope;
    
    Font* font = internalPtr<Font>(info, CLASS_Font);
    if(font == 0) {
        return;
    }
    Local<String> text = info[0]->ToString();
    int len = text->Length();
    uint16_t buf[len + 1];

    texture_font_load_glyphs(font->font, (const wchar_t*)buf);
}
METHOD_BEGIN(measure, info) {
    HandleScope scope;
    
    Font* font = internalPtr<Font>(info, CLASS_Font);
    if(font == 0) {
        return;
    }
    String::Utf8Value text(info[0]->ToString());
    wchar_t* wtext = (wchar_t*)(*text);

    wprintf(L"%s\n", *text);
    texture_font_load_glyphs(font->font, (const wchar_t*)(*text));
}
static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, load, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, measure, ReadOnly | DontDelete);

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
    font = texture_font_new_fn(atlas->atlas, *path, depth, load_font_assets);
    delete file;

    mRelease = false;
}
