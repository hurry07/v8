/*
 * AssetUtil.h
 *
 *  Created on: 2013-7-19
 *      Author: jie
 */

#ifndef ASSETUTIL_H_
#define ASSETUTIL_H_

#include <v8.h>
#include "../classes/file.h"

class AssetFile;

class AssetUtil {
public:
	AssetUtil();
	virtual ~AssetUtil();

    /**
     * load asset to file
     */
	static void load(AssetFile* file, const char* path);
};

#endif /* ASSETUTIL_H_ */
