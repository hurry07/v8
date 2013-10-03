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
var _NodeIterator = require('component/selector/nodeiterator.js');
var _NodeListener = require('component/selector/nodelistener.js');
var _matcher = require('component/selector/selector.js');
var _parser = require('component/selector/parser.js');

function parseSelector(str) {
    var p = new _parser();
    p.parse(str);
}

//parseSelector('div   >   image');
//parseSelector('div>image');
//parseSelector('a>image>ui');
//parseSelector('a >image>ui');
//parseSelector('a > image>ui');
//parseSelector('a  >  image>ui');
//parseSelector('a   >   image>ui');
//parseSelector('a   >   image > ui');
//parseSelector('a   >   image  >  ui');
//parseSelector('a#abc');
//parseSelector('#abc');
//parseSelector('#abc>div');
//parseSelector('div>#abc');
//parseSelector('div > #abc>div');
//parseSelector('div > table#abc > div');
//parseSelector('div > table#abc>div.red');
//parseSelector('a>div.red');
//parseSelector('div.red>div.blue');
//parseSelector('div.red>div#blue');
//parseSelector('div.red>#blue');
//parseSelector('div.red>#blue');
parseSelector('div[a=b]');
parseSelector('div.red>div[a=b]');
parseSelector('div[a=b] div');
parseSelector('div[a=b] +div');
parseSelector('div[a=b]+div');
parseSelector('div#user_name image:focus');
parseSelector('div#user_name>image:focus');
parseSelector('div#user_name  >  image:focus');

//function spiltProp(p) {
//    var prop = {};
//    if (!p || p.length == 0) {
//        return prop;
//    }
//    for (var i = -1, coll = p.split(','), l = coll.length; ++i < l;) {
//        var namevalue = coll[i].split('=');
//        prop[namevalue[0]] = namevalue[1];
//    }
//    return prop;
//}
//function TestNode(type, prop, children) {
//    this.type = type;
//    this.properties = spiltProp(prop);
//    this.children = children;
//}
//TestNode.prototype.getPropStr = function () {
//    var str = [];
//    for (var i in this.properties) {
//        str.push(i + ':' + this.properties[i]);
//    }
//    return '{' + str.join(',') + '}';
//}
//TestNode.prototype.toString = function () {
//    return this.type + this.getPropStr();
//}
//
//var tree = new TestNode('root', '', [
//    new TestNode('div', 'id=div1', [
//        new TestNode('image', 'id=image1', [
//        ]),
//        new TestNode('image', 'id=image2', [
//        ]),
//        new TestNode('image', 'id=image3', [
//        ])
//    ]),
//    new TestNode('image', 'id=middiv'),
//    new TestNode('image', 'id=middiv'),
//    new TestNode('div', 'id=div2'),
//    new TestNode('image', 'id=middiv'),
//    new TestNode('div', 'id=div3')
//]);
//
//
//var itorImpe = new _NodeIterator();
//console.log('------------->>1');
//var root = _CSSNode.wrap(tree);
//itorImpe.childFirst(root, new _NodeListener(new _matcher.TypeMatcher('div')));
//root.print();
//
//console.log('------------->>2');
//root = _CSSNode.wrap(tree);
//itorImpe.nodeFirst(root, new _NodeListener(new _matcher.TypeMatcher('div')));
//root.print();

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
