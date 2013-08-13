var gl = require('opengl');

/*
for(var i in gl) {
	console.log(i, gl[i]);
}
*/
function Game() {
}
var game = new Game();

//var gVertexShader = ["attribute vec4 vPosition;",//
//                     "void main() {",//
//                     "    gl_Position = vPosition;",//
//                     "}"].join('\n');
var gVertexShader = [//
    "attribute vec4 vPosition;",//
	"void main() {",//
	"    gl_Position = vPosition;",//
    "}"].join('\n');
var gFragmentShader = [//
	"precision mediump float;",//
	"void main() {",//
	"    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);",//
    "}"].join('\n');

var gProgram;
var gvPositionHandle;

/**
* @param string gVertexShader
* @param string gFragmentShader
*/
//function createProgram(gVertexShader, gFragmentShader) {
//	var vertexShader = gl.createShader(gl.GL_VERTEX_SHADER, pVertexSource);
//	if (!vertexShader) {
//		return 0;
//	}
//	var pixelShader = gl.createShader(gl.GL_FRAGMENT_SHADER, pFragmentSource);
//	if (!pixelShader) {
//		return 0;
//	}
//	var program = gl.createProgram();
//	if (program) {
//		gl.attachShader(program, vertexShader);
//		gl.attachShader(program, pixelShader);
//		gl.linkProgram(program);
//		var linkStatus = gl.getProgramParameter(program, gl.GL_LINK_STATUS);
//		if (!linkStatus) {
//			var bufLength = getShaderParameter(program, gl.GL_INFO_LOG_LENGTH);
//			if (bufLength) {
//				//char* buf = (char*) malloc(bufLength);
//				//if (buf) {
//					//glGetProgramInfoLog(program, bufLength, NULL, buf);
//					console.log("Could not link program:");
//					//free(buf);
//				//}
//			}
//			gl.deleteProgram(program);
//			program = 0;
//		}
//	}
//	return program;
//}
//function setupGraphics() {
//	gProgram = createProgram(gVertexShader, gFragmentShader);
//	if (!gProgram) {
//		console.log("Could not create program.");
//		return false;
//	}
//	gvPositionHandle = gl.getAttribLocation(gProgram, "vPosition");
//
//	gl.Viewport(0, 0, 800, 480);
//	return true;
//}
//var grey = 0;
//function renderFrame() {
//	grey += 0.01f;
//	if (grey > 1.0f) {
//		grey = 0.0f;
//	}
//
//	gl.clearColor(grey, grey, grey, 1.0f);
//	gl.clear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
//
//	gl.useProgram(gProgram);
//	gl.vertexAttribPointer(gvPositionHandle, 2, gl.GL_FLOAT, gl.GL_FALSE, 0, gTriangleVertices);
//	gl.enableVertexAttribArray(gvPositionHandle);
//	gl.drawArrays(GL_TRIANGLES, 0, 3);
//}

game.runcount = 0;
game.pause = function() {
}
game.resume = function() {
}
game.render = {
    onSurfaceCreated: function (width, height) {
    	setupGraphics();
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
//    	gl.clearColor(1,0,0,1);
    	game.runcount++;
    }
};
exports = module.exports = game;
