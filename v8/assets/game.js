//require('tools/glwrap.js').wrap();
var _surfaceview = require('surfaceview.js');
var _framerate = require('tools/framerate.js');

var _gl = require('opengl');
var _global = require('framework/global.js');

var mCamera = _global.mCamera;
var mRenderContext = _global.mRenderContext;

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;
var _inherit = require('core/inherit.js');

var firstInit = true;
function Game() {
}
Game.prototype.onSurfaceCreated = function (width, height) {
    _gl.clearColor(1, 1, 1, 0);

    _gl.enable(_gl.BLEND);
    _gl.blendFunc(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);

    _gl.disable(_gl.DEPTH_TEST);
    _gl.disable(_gl.STENCIL_TEST);
    _gl.disable(_gl.SCISSOR_TEST);

    mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
    mRenderContext.onChange();
    mCamera.setViewport(width, height);
    mCamera.viewport();

    if (firstInit) {
        var _timer = require('core/timer.js');
        var tick = new _timer.TickTack();
        _global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
        //_global.registerScene(require('scenes/game.js').newInstance('game', width, height));
        tick.check('registerScene');
        firstInit = false;
    }
    _global.updateContext.reset();
};
Game.prototype.onSurfaceChanged = function (width, height) {
    mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
    mRenderContext.onChange();
    mCamera.setViewport(width, height);
    mCamera.viewport();

    _global.onSizeChange(width, height);
};
Game.prototype.onDrawFrame = function () {
    _global.runSchedule();
    _framerate.update();
};
Game.prototype.bind = function () {
    _surfaceview.bind(this);
}
Game.prototype.pause = function () {
}
Game.prototype.resume = function () {
    _surfaceview.bind(this);
}

var game = new Game();
game.pause = function () {
    console.log('game.js pause');
};
game.resume = function () {
    console.log('--->game.resume');
//    _global.updateContext.reset();
};
game.destory = function () {
    console.log('--->game.destory');
    require('tools/glwrap.js').wrap();
}

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
