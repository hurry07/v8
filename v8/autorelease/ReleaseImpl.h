//
//  ReleaseImpl.h
//  v8
//
//  Created by jie on 13-9-27.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#ifndef __v8__ReleaseImpl__
#define __v8__ReleaseImpl__

#include <v8.h>
#include <Opengl/gl3.h>
#include <string>

enum ReleaseType {
    RELEASE_GLBuffer = 0,
    RELEASE_GLTexture
};

class ReleaseTask {
public:
    static ReleaseTask* createTaskEnum(ReleaseType type);
    static ReleaseTask* createTask(int type);
    ReleaseTask();
    virtual ~ReleaseTask();
    virtual void init(const v8::FunctionCallbackInfo<v8::Value> &args)=0;
    virtual void release()=0;
};

// ==========================
// GLBuffer
// ==========================
class ReleaseGLBuffer : public ReleaseTask {
public:
    ReleaseGLBuffer();
    virtual ~ReleaseGLBuffer();
    virtual void init(const v8::FunctionCallbackInfo<v8::Value> &args);
    virtual void release();
private:
    GLuint mBuffer;
};

// ==========================
// GLTexture
// ==========================
class ReleaseGLTexture : public ReleaseTask {
public:
    ReleaseGLTexture();
    virtual ~ReleaseGLTexture();
    virtual void init(const v8::FunctionCallbackInfo<v8::Value> &args);
    virtual void release();
private:
    GLuint mTexture;
    std::string mUrl;
};

#endif /* defined(__v8__ReleaseImpl__) */
