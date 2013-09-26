var _framerate = require('tools/framerate.js');
var _gl = require('opengl');
var _global = require('framework/global.js');

var mCamera = _global.mCamera;
var mRenderContext = _global.mRenderContext;

var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;
//var _Font = require('core/font.js').font;
//var _Atlas = require('core/font.js').atlas;
var _inherit = require('core/inherit.js');

//console.log('_font', _Font);
//var f = new _Font(new _Atlas(512, 512, 1), 'fonts/fat.ttf', 40);
////f.load('0 !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~');
////f.load('你好');
//f.load('abcde你好abcde捞淼');
//console.log(f.outline_type(), f.outline_thickness());
//
//var values = new Float32Array(20);
//f.measure('你好捞淼', values.subarray(8), 1, 4);
//console.log(Array.prototype.join.call(values, ','));
//
//values = new Float32Array(64);
//f.glyphs('你好捞淼', values.subarray(8), 1, 4);
//console.log('-----------');
//for (var i = 0; i < values.length; i += 8) {
//    console.log(Array.prototype.slice.call(values, i, i + 8).join(','));
//}

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
//        _gl.clearColor(1, 1, 1, 0);
        _gl.clearColor(1, 1, 1, 1);

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
            _global.registerScene(require('scenes/cover.js').newInstance('cover', width, height));
            //_global.registerScene(require('scenes/game.js').newInstance('cover', width, height));
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
