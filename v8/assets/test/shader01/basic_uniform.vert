#version 120
#pragma optimize(on)
attribute vec3 VertexPosition;
attribute vec3 VertexColor;

varying vec3 Color;
float myfunc (float f, out float g);

struct light {
    float intensity;
    vec3 position;
} lightVar;

struct BlobSettings {
    float r;
    float g;
    float b;
    float a;
};

uniform BlobSettings Blob;

//uniform struct {
//  mat4 RotationMatrix;
//  mat4 ViewMatrix; } MyMats;

uniform mat4 RotationMatrix;
//uniform mat4 Mats[2];

void main()
{
    Color = VertexColor;
    Color.r = Blob.r;
    Color.g = Blob.g;
    Color.b = Blob.b;
    gl_Position = RotationMatrix * vec4(VertexPosition, 1.0);
}
