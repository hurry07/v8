#version 120

attribute vec3 VertexPosition;
attribute vec3 VertexTexCoord;

varying vec3 TexCoord;

void main()
{
    TexCoord = VertexTexCoord;
    gl_Position = vec4(VertexPosition,1.0);
}
