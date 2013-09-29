var _framerate = require('tools/framerate.js');
var _gl = require('opengl');
var _global = require('framework/global.js');

var mCamera = _global.mCamera;
var mRenderContext = _global.mRenderContext;

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;
var _inherit = require('core/inherit.js');

var _CSSNode = require('component/selector/cssnode.js');
var _itorImpe = require('component/selector/nodeiterator.js');
function TestNode(name, children) {
    this.name = name;
    this.children = children;
}
TestNode.prototype.toString = function () {
    return this.name;
}

function NodeListener() {
}
NodeListener.prototype.onNode = function (cssnode) {
    console.log(cssnode.node);
}

var root = _CSSNode.wrap(new TestNode('root', [
    new TestNode('div:1', [
        new TestNode('image#image1', [
        ]),
        new TestNode('image#image2', [
        ]),
        new TestNode('image#image3', [
        ])
    ]),
    new TestNode('div#2')
]));
root.print();

var itorImpe = new _itorImpe();
console.log('-------------');
itorImpe.init(root).childFirst(new NodeListener());
console.log('-------------');
itorImpe.init(root).nodeFirst(new NodeListener());

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
//            _global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
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
