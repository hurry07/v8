#version 120

vec3 VertexPosition;
vec3 VertexColor;

varying vec3 Color;

//uniform struct {
//  mat4 RotationMatrix;
//  mat4 ViewMatrix; } MyMats;

uniform mat4 RotationMatrix;
//uniform mat4 Mats[2];

void main()
{
    Color = VertexColor;
    gl_Position = RotationMatrix * vec4(VertexPosition, 1.0);
}
