var gl = require('opengl');
//var gljs = require('test/gljs.js');
//var gljs = require('test/shader01/game.js');
var gljs = require('test/shader01/game_uniformblock.js');

var file = require('core/file.js');
var buffer = require('modules/typedbuffer.js');
var math3d = require('core/math3d.js');
var clz = require('nativeclasses');
var Image = clz.image;

var vector2 = math3d.vector2;
var vector3 = math3d.vector3;
var vec3s = math3d.vec3s;

function loadOBJ(fileName) {
    var f = new file();
    f.loadAsset(fileName);
    var s = f.getContent();
    f.release();

    var points = [];
    var normals = [];
    var texCoords = [];
    var faces = [];

    var fpoint = new Array(3);
    var fcount = 0;
    var index = -1;
    var current = 0;

    while((current = s.indexOf('\n', index + 1)) != -1) {
        var line = s.slice(index + 1, current);
        var tokens = line.split(/\s+/);
        var token = tokens.shift();
        if (token == 'v') {
            points.push(new vector3(tokens));
        } else if (token == 'vt') {
            texCoords.push(new vector2(tokens));
        } else if (token == 'vn') {
            normals.push(new vector3(tokens));
        } else if (token == 'f') {
            fcount = 0;
            console.log('--->',tokens, tokens.length, tokens[0]);
            while (tokens.length > 0) {
                var sh = tokens.shift();
                var refs = sh.split('/');
                if(refs.length != 3) {
                    throw("Missing some data for vertex" + ',' + refs.length + ',' + sh + ',' + line);
                }
                if(refs[0] != refs[1] || refs[0] != refs[2]) {
                    throw("Indexes are not consistent.");
                }
                fpoint[fcount++] = refs[0];
            }
            faces.push(new vec3s(fpoint));
        }

        index = current;
    }
    console.log(texCoords.length);
    console.log(points.length);
}

//loadOBJ('chapter02/media/bs_ears.obj');
console.log('47');
//console.test('47');

var img = new Image('images/pngnow.png');
console.log('img.width', img.width, 'height', img.height);

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
//        gljs.setupGraphics(width, height);
    },
    onSurfaceChanged: function (width, height) {
    },
    onDrawFrame: function () {
//        gljs.renderFrame();
//        game.runcount++;
    }
};
exports = module.exports = game;
