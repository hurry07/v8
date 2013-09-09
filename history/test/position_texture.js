var program = require('glcore/program.js');
var gl = require('opengl');

var _camera = require('render/camera.js');
var _Sprite = require('drawable/spritenode.js');
var _Container = require('component/container.js');
var _material = require('render/material.js');
var _Context = require('render/global.js');

var R = require('framework/R.js');
var _textures = require('framework/texture.js');

var mProgram;
var mCamera;
var mContext;
var mContainer;

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

    {
        mContainer = new _Container();

        var f1 = _textures.createFrame(R.test);
        var sprite1 = new _Sprite(new _material(mProgram, f1.texture), f1);
        sprite1.setAnthor(0.5, 0.5);
        sprite1.setScale(0.5, -0.5);
        sprite1.setRotate(30);
        mContainer.addChild(sprite1);

        var f2 = _textures.createFrame(R.word);
        var sprite2 = new _Sprite(new _material(mProgram, f2.texture), f2);
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
