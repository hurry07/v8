/*
 * AssetUtil.cpp
 *
 *  Created on: 2013-7-19
 *      Author: jie
 */

#include "AssetUtil.h"
#include <string>
#include "../global.h"

using namespace v8;

AssetUtil::AssetUtil() {
}
AssetUtil::~AssetUtil() {
}

AssetFile* AssetUtil::load(const char* path) {
    std::string abspath(source_root);
    abspath.append(path);
    
    FILE* file = fopen(abspath.c_str(), "rb");
    if (file == NULL) {
        return 0;
    }
    
    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    rewind(file);
    char* chars = new char[size + 1];
    chars[size] = 0;
    for (int i = 0; i < size;)
    {
        int read = fread(&chars[i], 1, size - i, file);
        i += read;
    }
    fclose(file);

	AssetFile* fbuffer = new AssetFile(chars, size);
	return fbuffer;
}

AssetFile::AssetFile(char* buffer, int length) {
	this->mBuffer = buffer;
	this->mLength = length;
}
AssetFile::~AssetFile() {
    if(mBuffer != 0) {
        free(mBuffer);
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

