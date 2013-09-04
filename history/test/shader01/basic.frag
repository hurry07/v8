#version 120
varying vec3 Color;
void main() {
    gl_FragColor.rba = vec4(Color, 1.0).rba;
    gl_FragColor.g = 0;
}
