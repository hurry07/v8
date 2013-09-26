#ifdef GL_ES															
precision lowp float;													
#endif																	
																		
varying vec2 v_texCoord;

uniform sampler2D u_texture;
uniform vec4 u_color;
																		
void main()																
{																		
	gl_FragColor = vec4(1,1,1,texture2D(u_texture, v_texCoord).a);
	gl_FragColor = vec4(1,0,1,0);
}
