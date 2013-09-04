var program = require('glcore/program.js');
var gl = require('opengl');
var geometry = require('core/glm.js');
var glm = geometry.glm;
var textures = require('glcore/textures.js');

var _camera = require('render/camera.js');
var _Sprite = require('render/sprite.js');
var _Container = require('render/container.js');
var _frame = require('render/textureframe.js');
var _material = require('render/material.js');
var _Context = require('render/context.js');

var mProgram;
var mCamera;
var mContext;
var mContainer;

function printArr(arr) {
    var s = '';
    for (var i = 0; i < arr.length; i++) {
        s += ',' + arr[i];
    }
    console.log(s);
}

function setupGraphics(w, h) {
    gl.clearColor(1, 1, 1, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.SCISSOR_TEST);

    mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(-w / 2, w / 2, -h / 2, h / 2, 9, 11);
    mContext = new _Context(mCamera);

    mProgram = program.createWithFile('shader/position_texture.vert', 'shader/position_texture.frag');
    mProgram.addMeshAttrib('positionTexture', 'a_position', 'a_texCoord');

    {
        mContainer = new _Container();

        var t1 = textures.createTexture2D('images/test.png');
        var sprite1 = new _Sprite(new _material(mProgram, t1), new _frame(t1));
        sprite1.setAnthor(0.5, 0.5);
        sprite1.setScale(0.5, -0.5);
        sprite1.setRotate(30);
        mContainer.addChild(sprite1);

        var t2 = textures.createTexture2D('images/word.png');
        var sprite2 = new _Sprite(new _material(mProgram, t2), new _frame(t2));
        sprite2.setAnthor(1, 1);
        sprite2.setScale(0.6, 0.6);
        mContainer.addChild(sprite2);

        mContainer.setPosition(-150, 0);
    }
}
function renderFrame() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    mContainer.draw(mContext);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
