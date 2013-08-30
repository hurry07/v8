//
//  main.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//


#include <string>

#include "app/Application.h"
#include <GLUT/GLUT.h>
#include <OpenGL/gl.h>

using namespace v8;

static void printGLString(const char *name, GLenum s) {
	const char *v = (const char *) glGetString(s);
	LOGI("GL %s = %s\n", name, v);
}

static bool checkGlError(const char* op) {
	for (GLint error = glGetError(); error; error = glGetError()) {
		LOGI("after %s() glError (0x%x)\n", op, error);
        return false;
	}
    return true;
}

std::string dir(std::string path, std::string subpath) {
    std::string::size_type index = path.find_last_of('/');
    if (index != std::string::npos){
        return path.substr(0, index).append(subpath);
    } else {
        return subpath;
    }
}
std::string source_root = dir(__FILE__, "/assets/").c_str();

void testVersion() {
    const GLubyte *renderer = glGetString( GL_RENDERER );
    const GLubyte *vendor = glGetString( GL_VENDOR );
    const GLubyte *version = glGetString( GL_VERSION );
    const GLubyte *glslVersion = glGetString(GL_SHADING_LANGUAGE_VERSION);

//    GLint major, minor;
//    glGetIntegerv(GL_VERSION, &major);
//    glGetIntegerv(GL_VERSION, &minor);
//    glGetIntegerv(GL_MAJOR_VERSION, &major);
//    glGetIntegerv(GL_MINOR_VERSION, &minor);
    printf("GL Vendor : %s\n", vendor);
    printf("GL Renderer : %s\n", renderer);
    printf("GL Version (string) : %s\n", version);
//    printf("GL Version (integer) : %d.%d\n", major, minor);
    printf("GLSL Version : %s\n", glslVersion);
}

Application* app = NULL;
void onDrawFrame() {
    app->onDrawFrame();
    if(!checkGlError("onDrawFrame==>")) {
        return;
    }
    glFlush();
    glutPostRedisplay();
}
int main(int argc, char ** argv)
{
	glutInit(&argc, argv);
    glutInitWindowSize(480, 480);
	glutCreateWindow("Xcode Glut Demo");

    testVersion();

    app = new Application();
    app->init();
    app->onSurfaceCreated(480, 480);
    app->onSurfaceChanged(480, 480);

	glutDisplayFunc(onDrawFrame);
	glutMainLoop();

    app->destroy();
    delete app;
    return 0;
}
