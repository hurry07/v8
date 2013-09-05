var _gl = require('opengl');

var _camera = require('render/camera.js');
var _Sprite = require('render/spritenode.js');
var _Container = require('render/container.js');
var _material = require('render/material.js');
var _Context = require('render/context.js');

var R = require('framework/r.js');
var _textures = require('framework/texture.js');
var _program = require('glcore/program.js');

function Timer() {
    this.lasttime = 0;
    this.reset();
}
Timer.prototype.reset = function () {
    this.lasttime = new Date().getTime();
}
Timer.prototype.getTimePass = function () {
    var delt = new Date().getTime();
    var seconds = (delt - this.lasttime) / 1000;
    this.lasttime = delt;
    return seconds;
}

var mProgram;
var mCamera;
var mContext;
var mContainer;
var mRotate = 0;

function createSprite(id) {
    var f = _textures.createFrame(id);
    return new _Sprite(new _material(mProgram, f.texture), f);
}

function Game() {
    this.mTimer = new Timer();
}

var game = new Game();
game.pause = function () {
}
game.resume = function () {
    this.mTimer.reset();
}
game.update = function () {
    mRotate += 100 * this.mTimer.getTimePass();
    mContainer.setRotate(mRotate);
}
game.render = {
    onSurfaceCreated: function (width, height) {
        _gl.clearColor(1, 1, 1, 0);

        _gl.enable(_gl.BLEND);
        _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);

        _gl.disable(_gl.DEPTH_TEST);
        _gl.disable(_gl.STENCIL_TEST);
        _gl.disable(_gl.SCISSOR_TEST);

        mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mContext = new _Context(mCamera);

        mProgram = _program.createWithFile('shader/position_texture.vert', 'shader/position_texture.frag');

        {
            mContainer = new _Container();
            mContainer.setPosition(width / 2, height / 2);

            var b_1 = createSprite(R.upgrade.b_01);
            b_1.setAnthor(0.5, 0.5);
            mContainer.addChild(b_1);
            var b_2 = createSprite(R.upgrade.b_02);
            b_2.setAnthor(0.5, 0.5);
            b_2.setRotate(90);
            mContainer.addChild(b_2);
        }
    },
    onSurfaceChanged: function (width, height) {
        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mContext.onChange();
    },
    onDrawFrame: function () {
        game.update();
        _gl.clear(_gl.COLOR_BUFFER_BIT);
        mContainer.draw(mContext);
    }
};

module.exports = game;
