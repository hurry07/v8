var _gl = require('opengl');
var Timer = require('core/timer.js');

var _Container = require('render/container.js');
var _global = require('framework/global.js');

var R = require('framework/r.js');
var mCamera = _global.mCamera;
var mContext = _global.mContext;
var mContainer;
var mRotate = 0;

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
//    mRotate += 100 * this.mTimer.getTimePass();
//    mContainer.setRotate(mRotate);
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
        _gl.viewport(0, 0, width, height);

        {
            mContainer = new _Container();
//            mContainer.setPosition(width / 2, height / 2);

            var $9patch = _global.sprite(R.word).$9patch().left(200).bottom(200).top(200).right(200).setSize(1024, 600).updateMesh();
            $9patch.setScale(0.5);

            var $9patch_h = _global.sprite(R.upgrade.b_01).$9patch_v().top(20).bottom(20).setSize(0, 300).updateMesh();
//            $9patch_h.setPosition(100, 100);

//            var b_1 = _global.spriteNode(R.upgrade.b_01);
//            b_1.setAnthor(0.5, 0.5);
//            mContainer.addChild(b_1);
            mContainer.addChild($9patch_h);
//            var b_2 = _global.colorNode([1, 0, 0, 1], 100, 100);
//            b_2.setAnthor(0.5, 0.5);
//            b_2.setRotate(90);
//            mContainer.addChild(b_2);
            mContainer.addChild($9patch);
            _global.scheduleRender.schedule(mContainer);
        }
    },
    onSurfaceChanged: function (width, height) {
        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mContext.onChange();
        _gl.viewport(0, 0, width, height);
    },
    onDrawFrame: function () {
        game.update();

        // drawing
        _gl.clear(_gl.COLOR_BUFFER_BIT);
        var itor = _global.scheduleRender.iterator();
        while (itor.hasNext()) {
            itor.next().draw(mContext);
        }
    }
};

module.exports = game;
