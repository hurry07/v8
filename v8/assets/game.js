var gl = require('opengl');
//var gljs = require('test/gljs.js');
//var gljs = require('test/shader01/game.js');
var gljs = require('test/shader01/game_uniformblock.js');

var file = require('core/file.js');
var buffer = require('modules/typedbuffer.js');
var math3d = require('core/math3d.js');

var vector2 = math3d.vector2;
var vector3 = math3d.vector3;
var vec3s = math3d.vec3s;

function loadOBJ(fileName) {
    var f = new file();
    f.loadAsset(fileName);
    var s = f.getContent();
    f.release();

    var lines = s.split(/\r?\n/);
    console.log(lines[0]);

    var points = [];
    var normals = [];
    var texCoords = [];
    var faces = [];

    for (var i = 0, length = lines.length; i < length; i++) {
        var line = lines[i];
        var tokens = line.split(/\s+/);
        var token = tokens.shift();
        if (token == 'v') {
            points.push(new vector3(tokens));
        } else if (token == 'vt') {
            texCoords.push(new vector2(tokens));
        } else if (token == 'vn') {
            normals.push(new vector3(tokens));
        } else if (token == 'f') {
            while (faces.length > 0) {
                faces.push(new vec3s(tokens.shift().split('/')));
            }
        }
    }
}

loadOBJ('chapter02/media/bs_ears.obj');

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
function setupGraphics() {
    console.log('gl', gl);
}
game.render = {
    onSurfaceCreated: function (width, height) {
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
