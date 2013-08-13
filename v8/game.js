var constants = require('constants.js');
console.log(JSON.stringify(constants));
var gl = require('opengl');

function Game() {
}
var game = new Game();
game.render = {
    onSurfaceCreated: function (width, height) {
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
        console.log('onDrawFrame~~');
    }
};

exports = module.exports = game;
