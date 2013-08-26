var gl = require('opengl');
var gljs = require('test/gljs.js');

/*
for(var i in gl) {
	console.log(i, gl[i]);
}
*/
function Game() {
}
var game = new Game();

game.runcount = 0;
game.pause = function() {
}
game.resume = function() {
}
function setupGraphics() {
    console.log('gl', gl);
}
game.render = {
    onSurfaceCreated: function (width, height) {
    	setupGraphics();
        gljs.setupGraphics(800, 480);
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
//    	gl.clearColor(1,0,0,1);
        console.log('onDrawFrame~~222');
        gljs.renderFrame();
    	game.runcount++;
    }
};
exports = module.exports = game;
