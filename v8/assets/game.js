var _gl = require('opengl');
var _global = require('framework/global.js');
var _event = require('core/event.js');
var _touchContext = _event.touchContext;
var _framerate = require('tools/framerate.js');

var mCamera = _global.mCamera;
var mRenderContext = _global.mRenderContext;
var mUpdateContext = _global.updateContext;

var mTouchBuffer = new Int32Array(16);
var mKeyBuffer = new Int32Array(12);

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;

var _inherit = require('core/inherit.js');
var _LinkedList = require('core/linkedlist_1.js');
function Cell(str) {
    this.str = str;
    this.next = this.previous = null;
}
Cell.prototype.toString = function () {
    return this.str;
}
var list1 = new _LinkedList();
var list2 = new _LinkedList();
for (var i = 0; i < 10; i++) {
    var c = new Cell('aa' + i);
    if (i % 2 == 0) {
        list1.add(c);
    } else {
        list2.add(c);
    }
}
list1.merge(list2);
console.log('---------------->>');
var itor = list1.iterator();
while (itor.hasNext()) {
    console.log(itor.next());
}
console.log('----------------<<');
var itor = list2.iterator();
while (itor.hasNext()) {
    console.log(itor.next());
}
console.log('----------------<<');

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
        _gl.blendFunc(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);

        _gl.disable(_gl.DEPTH_TEST);
        _gl.disable(_gl.STENCIL_TEST);
        _gl.disable(_gl.SCISSOR_TEST);

        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mRenderContext.onChange();
        mCamera.setViewport(width, height);
        mCamera.viewport();

        if (firstInit) {
            //_global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
            _global.registerScene(require('scenes/game.js').newInstance('cover', width, height));
            firstInit = false;
        }
        _global.updateContext.reset();
    },
    onSurfaceChanged: function (width, height) {
        mCamera.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, width, 0, height, 9, 11);
        mRenderContext.onChange();
        mCamera.setViewport(width, height);
        mCamera.viewport();

        _global.onSizeChange(width, height);
    },
    onDrawFrame: function () {
        _global.runSchedule();
//        _framerate.update();
    }
};

module.exports = game;
