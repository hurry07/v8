//
//  file.h
//  v8
//
//  Created by jie on 13-8-15.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__file__
#define __v8__file__

class AssetFile {
public:
	AssetFile();
	~AssetFile();

    bool isEmpty();
    void init(char* buffer, int length);
	void release();
    char* allocate(int length);
	const char* chars();
	int size();
    
    static AssetFile* loadAsset(const char* path);
private:
	char* mBuffer;
	int mLength;
};

#endif /* defined(__v8__file__) */
