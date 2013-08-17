var gl = require('opengl');

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
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
    	gl.clearColor(1,0,0,1);
        console.log('onDrawFrame~~222');
    	game.runcount++;
    }
};
exports = module.exports = game;
