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
        console.log('onSurfaceCreated');
        gljs.setupGraphics(width, height);
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
        gljs.renderFrame();
    	game.runcount++;
    }
};
exports = module.exports = game;
