var _textures = require('framework/texture.js');
var _program = require('framework/program.js');
var _Context = require('render/context.js');
var _camera = require('render/camera.js');

var _Sprite = require('drawable/spritenode.js');
var _Color = require('drawable/colornode.js');

// keep all global variables
mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, 1, 0, 1, 9, 11);
mContext = new _Context(mCamera);

function spriteNode(id) {
    var f = _textures.createFrame(id);
    return new _Sprite(_program.positionTexture.material(f), f);
}
function colorNode(color, w, h) {
    return new _Color(_program.positionColor.material(color), w, h);
}

exports.mCamera = mCamera;
exports.mContext = mContext;
exports.spriteNode = spriteNode;
exports.colorNode = colorNode;