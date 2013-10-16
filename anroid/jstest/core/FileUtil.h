//
//  FileUtil.h
//  jstest
//
//  Created by jie on 13-7-23.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __jstest__FileUtil__
#define __jstest__FileUtil__

#include <iostream>

class IOStream {
public:
    IOStream(FILE* file, int length);
    ~IOStream();

    void close();
    int length();
    void read(char* buffer);

private:
    FILE* file;
    int length;
}

class FileUtil {
public:
    static IOStream* open(const char* path);
}

#endif /* defined(__jstest__FileUtil__) */
