/*
 * AssetUtil.h
 *
 *  Created on: 2013-7-19
 *      Author: jie
 */

#ifndef ASSETUTIL_H_
#define ASSETUTIL_H_

#include <v8.h>

class AssetFile {
public:
	AssetFile(char* buffer, int length);
	~AssetFile();

	void release();
	const char* chars();
	int size();
private:
	char* mBuffer;
	int mLength;
};

class AssetUtil {
public:
	AssetUtil();
	virtual ~AssetUtil();

	static AssetFile* load(const char* path);
};

#endif /* ASSETUTIL_H_ */
