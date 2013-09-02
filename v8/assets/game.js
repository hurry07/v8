var gl = require('opengl');
//var gljs = require('test/gljs.js');
//var gljs = require('test/shader01/game.js');
var gljs = require('test/shader01/game_uniformblock.js');

var file = require('core/file.js');
var buffer = require('glcore/buffers.js');
var math3d = require('core/glm.js');
var clz = require('nativeclasses');
var Texture2D = require('glcore/textures.js').Texture2D;

var vector2 = math3d.vector2;
var vector3 = math3d.vector3;
var vec3s = math3d.vec3s;

var d = new Date();
console.log('date:' + d + ',' + d.getTime());

var mesh = require('render/mesh.js');
var mTP = mesh.createMesh('tp', 2);
mTP.bindAttrib();

/*
 for(var i in gl) {
 console.log(i, gl[i]);
 }
 */
function Game() {
}

var game = new Game();
game.runcount = 0;
game.pause = function () {
}
game.resume = function () {
}
game.render = {
    onSurfaceCreated: function (width, height) {
        gljs.setupGraphics(width, height);
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
        gljs.renderFrame();
//        game.runcount++;
    }
};
exports = module.exports = game;
