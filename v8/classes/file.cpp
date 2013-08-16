//
//  file.cpp
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include "file.h"
#include "../utils/AssetUtil.h"

void AssetFile::init(char* buffer, int length) {
	this->mBuffer = buffer;
	this->mLength = length;
}
bool AssetFile::isEmpty() {
    return mBuffer == 0;
}
char* AssetFile::allocate(int length) {
    mLength = length;
    mBuffer = new char[length + 1];
    mBuffer[length] = 0;
    return mBuffer;
}
AssetFile::AssetFile() : mBuffer(0), mLength(0) {
}
AssetFile::~AssetFile() {
    if(mBuffer != 0) {
        delete[] mBuffer;
    }
}
void AssetFile::release() {
	delete this;
}
const char* AssetFile::chars() {
	return this->mBuffer;
}
int AssetFile::size() {
	return this->mLength;
}

AssetFile* AssetFile::loadAsset(const char* path) {
    AssetFile* file = new AssetFile();
    AssetUtil::load(file, path);
    return file;
}

