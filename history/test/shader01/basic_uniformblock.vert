#version 120

attribute vec3 VertexPosition;
attribute vec2 VertexTexCoord;

varying vec2 TexCoord;

void main()
{
    TexCoord = VertexTexCoord;
    gl_Position = vec4(VertexPosition,1.0);
}
