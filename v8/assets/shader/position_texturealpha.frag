#ifdef GL_ES															
precision lowp float;													
#endif																	
																		
varying vec2 v_texCoord;

uniform sampler2D u_texture;
uniform vec4 u_color;
																		
void main()																
{																		
	gl_FragColor =  vec4(0,0,0,texture2D(u_texture, v_texCoord).a);
}
