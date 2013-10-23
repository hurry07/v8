//require('tools/glwrap.js').wrap();
var _global;
var mCamera;
var mRenderContext;

var _framerate = require('tools/framerate.js');
var _gl = require('opengl');

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;
var _inherit = require('core/inherit.js');

var firstInit = true;
function Game() {
    console.log('function Game');
}
Game.prototype.initGL = function (width, height) {
    if(!firstInit) {
        return;
    }

    _global = require('framework/global.js');
    mCamera = _global.mCamera;
    mRenderContext = _global.mRenderContext;

    _gl.clearColor(1, 1, 1, 0);

    _gl.enable(_gl.BLEND);
    _gl.blendFunc(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);

    _gl.disable(_gl.DEPTH_TEST);
    _gl.disable(_gl.STENCIL_TEST);
    _gl.disable(_gl.SCISSOR_TEST);

    var _timer = require('core/timer.js');
    var tick = new _timer.TickTack();
//    _global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
    _global.registerScene(require('scenes/game.js').newInstance('game', width, height));
    tick.check('registerScene');
    firstInit = false;
};
Game.prototype.setupCamera = function (width, height) {
    mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
    mRenderContext.onChange();
    mCamera.setViewport(width, height);
    mCamera.viewport();
};
Game.prototype.onSurfaceCreated = function (width, height) {
    this.initGL(width, height);
    this.setupCamera(width, height);
    _global.updateContext.reset();
};
Game.prototype.onSurfaceChanged = function (width, height) {
    this.setupCamera(width, height);
    _global.onSizeChange(width, height);
};
Game.prototype.onDrawFrame = function () {
    _global.runSchedule();
    _framerate.update();
};
Game.prototype.pause = function () {
    console.log('Game.prototype.pause=>');
}
Game.prototype.resume = function () {
    console.log('Game.prototype.resume=>');
}

var game = new Game();
function wrap(obj, name) {
    var fn = obj[name];
    obj[name] = function () {
        try {
            fn.apply(obj, arguments);
        } catch (e) {
            console.log(name + '.exception:' + e);
        }
    }
}
for (var i in game.render) {
    wrap(game.render, i);
}

module.exports = game;
