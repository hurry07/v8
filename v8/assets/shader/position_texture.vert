uniform mat4 u_pvmMatrix;

attribute vec2 a_position;
attribute vec2 a_texCoord;

#ifdef GL_ES											
varying mediump vec2 v_texCoord;
#else													
varying vec2 v_texCoord;								
#endif													
														
void main()												
{														
    gl_Position = u_pvmMatrix * vec4(a_position,0,1);
	v_texCoord = a_texCoord;
}														
