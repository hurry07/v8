#version 120

varying vec2 TexCoord;
uniform sampler2D Tex1;

struct BlobStruct {
  vec4 InnerColor;
  vec4 OuterColor;
  float RadiusInner;
  float RadiusOuter;
};

uniform BlobStruct Blob;

void main() {
/*
    float dx = TexCoord.x - 0.5;
    float dy = TexCoord.y - 0.5;
    float dist = sqrt(dx * dx + dy * dy);
    gl_FragColor = mix(
            Blob.InnerColor,
            Blob.OuterColor,
            smoothstep(Blob.RadiusInner, Blob.RadiusOuter, dist)
    );
*/
//    gl_FragColor = texture2D(Tex1,TexCoord).bgra;
    gl_FragColor = texture2D(Tex1,TexCoord);
}
