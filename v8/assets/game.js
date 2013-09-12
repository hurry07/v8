var _gl = require('opengl');
var _global = require('framework/global.js');
var _event = require('core/event.js');
var _framerate = require('tools/framerate.js');

var mCamera = _global.mCamera;
var mRenderContext = _global.mRenderContext;
var mUpdateContext = _global.updateContext;

var mTouchBuffer = new Int32Array(16);
var mKeyBuffer = new Int32Array(12);

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;

var firstInit = true;
function Game() {
}
var game = new Game();
game.pause = function () {
}
game.resume = function () {
    _global.updateContext.reset();
}

var mCount = 0;
game.render = {
    onSurfaceCreated: function (width, height) {
        _gl.clearColor(1, 1, 1, 0);

        _gl.enable(_gl.BLEND);
        _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);

        _gl.disable(_gl.DEPTH_TEST);
        _gl.disable(_gl.STENCIL_TEST);
        _gl.disable(_gl.SCISSOR_TEST);

        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mRenderContext.onChange(width, height);
        _gl.viewport(0, 0, width, height);

        if (firstInit) {
            _global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
            firstInit = false;
        }
        _global.updateContext.reset();
    },
    onSurfaceChanged: function (width, height) {
        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mRenderContext.onChange(width, height);
        _gl.viewport(0, 0, width, height);

        // update
        var itor = _global.scenes.iterator();
        while (itor.hasNext()) {
            itor.next().onSizeChange(width, height);
        }
    },
    onDrawFrame: function () {
        _global.runSchedule();

//        if (mCount++ > 2000) {
//            mCount = 0;
//            var remain = _event.touchEvent.getEvents(mTouchBuffer);
//            if (remain != -1) {
//                console.log('touchEvent:' + remain, Array.prototype.join.call(mTouchBuffer, ','));
//            }
//            remain = _event.keyEvent.getEvents(mKeyBuffer);
//            if (remain != -1) {
//                console.log('keyEvent:' + remain, Array.prototype.join.call(mKeyBuffer, ','));
//            }
//        }
        _framerate.update();
    }
};

module.exports = game;
