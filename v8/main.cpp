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

template <typename T>
void tt(T t) {
    T* t1;
    int len;
    test1(&t1, &len);
}

class A {
public:
    A(int a) {
        this->a = a;
    }
    int a;
    void print() {
        LOGI("A [%d]", a);
    }
};

void copy(A& a1, A& a2) {
    a1 = a2;
}

int main(int argc, char ** argv)
{
    A* a1 = new A(100);
    A* a2 = new A(200);
    a1->print();
    a2->print();

    copy(*a1, *a2);
    a1->print();
    a2->print();

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
