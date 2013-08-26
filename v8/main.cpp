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

static void checkGlError(const char* op) {
	for (GLint error = glGetError(); error; error = glGetError()) {
		LOGI("after %s() glError (0x%x)\n", op, error);
	}
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

Application* app = NULL;
void onDrawFrame() {
    app->onDrawFrame();
    glFlush();
    glutPostRedisplay();
}
int main(int argc, char ** argv)
{
	glutInit(&argc, argv);
    glutInitWindowSize(800, 480);
	glutCreateWindow("Xcode Glut Demo");

    app = new Application();
    app->init();
    app->onSurfaceCreated();
    app->onSurfaceChanged(800, 480);

	glutDisplayFunc(onDrawFrame);
	glutMainLoop();

    app->destroy();
    delete app;
    return 0;
}
