/* ============================================================================
 * Freetype GL - A C OpenGL Freetype engine
 * Platform:    Any
 * WWW:         http://code.google.com/p/freetype-gl/
 * ----------------------------------------------------------------------------
 * Copyright 2011,2012 Nicolas P. Rougier. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY NICOLAS P. ROUGIER ''AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL NICOLAS P. ROUGIER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are
 * those of the authors and should not be interpreted as representing official
 * policies, either expressed or implied, of Nicolas P. Rougier.
 * ============================================================================
 *
 * Example showing regular font usage
 *
 * ============================================================================
 */
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
static GLuint shader;
static vertex_buffer_t *buffer;
static mat4   model, view, projection;


// ---------------------------------------------------------------- display ---
static void display( void )
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
static void reshape(int width, int height)
{
    glViewport(0, 0, width, height);
    mat4_set_orthographic( &projection, 0, width, 0, height, -1, 1);
}


// --------------------------------------------------------------- keyboard ---
static void keyboard( unsigned char key, int x, int y )
{
    if ( key == 27 )
    {
        exit( 1 );
    }
}


// --------------------------------------------------------------- add_text ---
static void add_text( vertex_buffer_t * buffer, texture_font_t * font, wchar_t * text, vec4 * color, vec2 * pen )
{
    //int size1 = buffer->vertices->size;
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
    //    int size2 = buffer->vertices->size;
    //    LOGI("%d", size2 - size1);
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
    printf("text length:%ld\n", sizeof(text));

    buffer = vertex_buffer_new( "vertex:3f,tex_coord:2f,color:4f" );
    vec2 pen = {{5,400}};
    vec4 black = {{0,0,1,1}};
    for( i=7; i < 27; ++i)
    {
        font = texture_font_new( atlas, filename, i );
        pen.x = 5;
        pen.y -= font->height;
        printf("fond.height:%f %f\n", font->height, pen.y);
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

