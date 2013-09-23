//
//  main.cpp
//  jstest
//
//  Created by jie on 13-7-22.
//  Copyright (c) 2013年 jie. All rights reserved.
//
#include <string>

#include "app/Application.h"
#include "classes/file.h"
#include "utils/AssetUtil.h"
#include "modules/CCImage.h"
#include "modules/CCTexture2D.h"
#include <GLUT/GLUT.h>
#include <OpenGL/gl.h>
//#include "TestGc.h"
#include "core/RingBuffer.h"
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/swizzle.hpp>
#include <ft2build.h>
#include FT_FREETYPE_H
#include "md5.h"
#include <iostream>
//#include "demo-font.h"

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

void testImageLoad() {
    JSFile* file = new JSFile();
    AssetUtil::load(file, "images/pngnow.png");
    node::CCImage* img = new node::CCImage();
    img->initWithImageData((void*)file->chars(), file->size());
    delete file;
    
    node::CCTexture2D* t2d = new node::CCTexture2D();
    t2d->initWithImage(img);
    
    LOGI("width:%d, height:%d", img->getWidth(), img->getHeight());
}

int powOf2(int num) {
    num--;
    int offset = 1;
    while ((num & (num + 1)) != 0) {
        num |= num >> offset;
        offset = offset << 1;
    }
    return num + 1;
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
void onSurfaceChanged(int w, int h) {
    app->onSurfaceChanged(w, h);
}
void onMouseClick(int button, int state, int x, int y) {
    //    LOGI("onTouch %d %d %d %d", button, state, x, y);
    app->appendMouseTouch(button, state, x, y);
}
void onMouseMove(int x, int y) {
    //    LOGI("onMove %d %d", x, y);
    app->appendMouseMove(x, y);
}
void onKeyPress(unsigned char key, int x, int y) {
    //    LOGI("onTouch %d %d %d", key, x, y);
    app->appendKeyPress(key, x, y);
}
void start(int argc, char ** argv, int width, int height) {
	glutInit(&argc, argv);
    glutInitWindowSize(width, height);
	glutCreateWindow("Xcode Glut Demo");
    
    testImageLoad();
    testVersion();
    
    app = new Application();
    app->init();
    app->resume();
    app->onSurfaceCreated(width, height);
    app->onSurfaceChanged(width, height);
    
	glutDisplayFunc(onDrawFrame);
    glutReshapeFunc(onSurfaceChanged);
    glutMouseFunc(onMouseClick);
    glutMotionFunc(onMouseMove);
    glutKeyboardFunc(onKeyPress);
	glutMainLoop();
    
    app->destroy();
    delete app;
}
#include <stdio.h>
#include <wchar.h>

#include "freetype-gl.h"
#include "mat4.h"
#include "shader.h"
#include "vertex-buffer.h"
#if defined(__APPLE__)
#include <Glut/glut.h>
#elif defined(_WIN32) || defined(_WIN64)
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif
#include "demo-font.h"


// ------------------------------------------------------- typedef & struct ---
typedef struct {
    float x, y, z;    // position
    float s, t;       // texture
    float r, g, b, a; // color
} vertex_t;


// ------------------------------------------------------- global variables ---
GLuint shader;
vertex_buffer_t *buffer;
mat4   model, view, projection;


// ---------------------------------------------------------------- display ---
void display( void )
{
    glClearColor( 1, 1, 1, 1 );
    glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );
    
    glEnable( GL_BLEND );
    glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );
    
    glUseProgram( shader );
    {
        glUniform1i( glGetUniformLocation( shader, "texture" ), 0 );
        glUniformMatrix4fv( glGetUniformLocation( shader, "model" ), 1, 0, model.data);
        glUniformMatrix4fv( glGetUniformLocation( shader, "view" ), 1, 0, view.data);
        glUniformMatrix4fv( glGetUniformLocation( shader, "projection" ), 1, 0, projection.data);
        vertex_buffer_render( buffer, GL_TRIANGLES );
    }
    glutSwapBuffers( );
}


// ---------------------------------------------------------------- reshape ---
void reshape(int width, int height)
{
    glViewport(0, 0, width, height);
    mat4_set_orthographic( &projection, 0, width, 0, height, -1, 1);
}


// --------------------------------------------------------------- keyboard ---
void keyboard( unsigned char key, int x, int y )
{
    if ( key == 27 )
    {
        exit( 1 );
    }
}


// --------------------------------------------------------------- add_text ---
void add_text( vertex_buffer_t * buffer, texture_font_t * font, wchar_t * text, vec4 * color, vec2 * pen )
{
    int size1 = buffer->vertices->size;
    size_t i;
    float r = color->red, g = color->green, b = color->blue, a = color->alpha;
    for( i=0; i<wcslen(text); ++i )
    {
        texture_glyph_t *glyph = texture_font_get_glyph( font, text[i] );
        if( glyph != NULL )
        {
            int kerning = 0;
            if( i > 0)
            {
                kerning = texture_glyph_get_kerning( glyph, text[i-1] );
            }
            pen->x += kerning;
            int x0  = (int)( pen->x + glyph->offset_x );
            int y0  = (int)( pen->y + glyph->offset_y );
            int x1  = (int)( x0 + glyph->width );
            int y1  = (int)( y0 - glyph->height );
            float x0f = x0;
            float y0f = y0;
            float x1f = x1;
            float y1f = y1;
            float s0 = glyph->s0;
            float t0 = glyph->t0;
            float s1 = glyph->s1;
            float t1 = glyph->t1;
            GLuint indices[6] = {0,1,2, 0,2,3};
            vertex_t vertices[4] = {
                { x0f,y0f,0,  s0,t0,  r,g,b,a },
                { x0f,y1f,0,  s0,t1,  r,g,b,a },
                { x1f,y1f,0,  s1,t1,  r,g,b,a },
                { x1f,y0f,0,  s1,t0,  r,g,b,a }
            };
            vertex_buffer_push_back( buffer, vertices, 4, indices, 6 );
            pen->x += glyph->advance_x;
        }
    }
    int size2 = buffer->vertices->size;
    LOGI("%d", size2 - size1);
}

// ------------------------------------------------------------------- main ---
int main_font( int argc, char **argv )
{
    glutInit( &argc, argv );
    glutInitWindowSize( 800, 400 );
    glutInitDisplayMode( GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH );
    glutCreateWindow( argv[0] );
    glutReshapeFunc( reshape );
    glutDisplayFunc( display );
    glutKeyboardFunc( keyboard );
    
    //    GLenum err = glewInit();
    //    if (GLEW_OK != err)
    //    {
    //        /* Problem: glewInit failed, something is seriously wrong. */
    //        fprintf( stderr, "Error: %s\n", glewGetErrorString(err) );
    //        exit( EXIT_FAILURE );
    //    }
    //    fprintf( stderr, "Using GLEW %s\n", glewGetString(GLEW_VERSION) );
    
    size_t i;
    texture_font_t *font = 0;
    texture_atlas_t *atlas = texture_atlas_new( 512, 512, 1 );
    const char * filename = "/Users/jie/svn/v8/deps/freetype-gl-read-only/fonts/Vera.ttf";

    wchar_t *text = L"A Quick Brown Fox Jumps Over The Lazy Dog 0123456789";
    LOGI("text length:%ld", sizeof(text));

    buffer = vertex_buffer_new( "vertex:3f,tex_coord:2f,color:4f" );
    vec2 pen = {{5,400}};
    vec4 black = {{0,0,1,1}};
    for( i=7; i < 27; ++i)
    {
        font = texture_font_new( atlas, filename, i );
        pen.x = 5;
        pen.y -= font->height;
        LOGI("fond.height:%f", font->height);
        texture_font_load_glyphs( font, text );
        add_text( buffer, font, text, &black, &pen );
        texture_font_delete( font );
    }
    glBindTexture( GL_TEXTURE_2D, atlas->id );
    
    shader = shader_load("/Users/jie/svn/v8/deps/freetype-gl-read-only/shaders/v3f-t2f-c4f.vert",
                         "/Users/jie/svn/v8/deps/freetype-gl-read-only/shaders/v3f-t2f-c4f.frag");
    mat4_set_identity( &projection );
    mat4_set_identity( &model );
    mat4_set_identity( &view );
    
    glutMainLoop( );
    return 0;
}
void PrintMD5(const string& str, MD5& md5) {
	std::cout << "MD5(\"" << str << "\") = " << md5.toString() << std::endl;
}
int main(int argc, char ** argv)
{
    main_font(argc, argv);
//    start(argc, argv, 800, 480);
//    FT_Library  library;
//    FT_Face     face;
//    FT_Error error = FT_Init_FreeType( &library );
//    if (error)
//    {
//        LOGI("an error occurred during library initialization");
//    }
//    error = FT_New_Face(library,
//                        "/Users/jie/svn/v8/deps/freetype-gl-read-only/fonts/Vera.ttf",
//                        0,
//                        &face );
//    if ( error == FT_Err_Unknown_File_Format )
//    {
//        LOGI("22");
////        ... the font file could be opened and read, but it appears
////        ... that its font format is unsupported
//    }
//    else if ( error )
//    {
//        LOGI("11");
////        ... another error code means that the font file could not
////        ... be opened or read, or simply that it is broken...
//    }
//    LOGI("face num_fixed_sizes:%d", face->num_fixed_sizes);
//    LOGI("face num_faces:%ld", face->num_faces);
//    LOGI("face available_sizes:%p", face->available_sizes);
//    LOGI("face units_per_EM:%hd", face->units_per_EM);
//    LOGI("face num_faces:%ld", face->num_faces);
//    LOGI("face num_faces:%ld", face->num_faces);
//    const char* uuid = env->GetStringUTFChars(str,NULL);
//    const char * pszText = cocos2d::CCIMEDispatcher::sharedDispatcher()->getContentText();
//    return env->NewStringUTF(pszText);
    
    return 0;
}
