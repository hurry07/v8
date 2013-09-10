var _gl = require('opengl');
var _global = require('framework/global.js');

var mCamera = _global.mCamera;
var mContext = _global.mContext;
var mUpdateContext = _global.updateContext;

function Game() {
}

var firstInit = true;
var game = new Game();
game.pause = function () {
}
game.resume = function () {
    _global.updateContext.reset();
}
game.render = {
    onSurfaceCreated: function (width, height) {
        _gl.clearColor(1, 1, 1, 0);

        _gl.enable(_gl.BLEND);
        _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);

        _gl.disable(_gl.DEPTH_TEST);
        _gl.disable(_gl.STENCIL_TEST);
        _gl.disable(_gl.SCISSOR_TEST);

        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mContext.onChange(width, height);
        _gl.viewport(0, 0, width, height);

        if (firstInit) {
            _global.registerScene(require('scenes/cover.js').newInstance());
            firstInit = false;
        }
        _global.updateContext.reset();
    },
    onSurfaceChanged: function (width, height) {
        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mContext.onChange(width, height);
        _gl.viewport(0, 0, width, height);
    },
    onDrawFrame: function () {
        // update
        mUpdateContext.ticktack();
        var itor = _global.scheduleUpdate.iterator();
        while (itor.hasNext()) {
            itor.next().update(mUpdateContext);
        }

        // drawing
        _gl.clear(_gl.COLOR_BUFFER_BIT);
        var itor = _global.scheduleRender.iterator();
        while (itor.hasNext()) {
            itor.next().draw(mContext);
        }
    }
};

module.exports = game;
