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
    vec4 InnerColor;
    vec4 OuterColor;
    float RadiusInner;
    float RadiusOuter;
};

uniform BlobSettings Blob;

//uniform struct {
//  mat4 RotationMatrix;
//  mat4 ViewMatrix; } MyMats;

uniform mat4 RotationMatrix;
//uniform mat4 Mats[2];

void main()
{
    Color = Blob.InnerColor.rgb;
    Color = VertexColor;
    gl_Position = RotationMatrix * vec4(VertexPosition, 1.0);
}
