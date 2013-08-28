#version 120
attribute vec3 VertexPosition;
attribute vec3 VertexColor;
layout (location = 0) in vec3 VertexP1;
varying vec3 Color;
void main() {
    Color = VertexColor;
    gl_Position = vec4(VertexPosition,1.0);
}
