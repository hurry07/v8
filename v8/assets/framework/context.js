var _textures = require('framework/texture.js');
var _program = require('framework/program.js');
var _Context = require('render/context.js');
var _camera = require('render/camera.js');

var _Sprite = require('drawable/spritenode.js');
var _9Patch = require('drawable/ninepatch.js');
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

/**
 * hold all dependencies for creating a sprite like node
 * @constructor
 */
function Sprite(material, texture) {
    this.material = material;
    this.texture = texture;
}
Sprite.prototype.sprite = function () {
    return new _Sprite(this.material, this.texture);
}
Sprite.prototype.$9patch = function () {
    return _9Patch.create9Patch.apply(this, [this.material, this.texture].concat(Array.prototype.slice.call(arguments, 0)));
}
Sprite.prototype.$9patch_v = function () {
    return _9Patch.create9Patch_v.apply(this, [this.material, this.texture].concat(Array.prototype.slice.call(arguments, 0)));
}
Sprite.prototype.$9patch_h = function () {
    return _9Patch.create9Patch_h.apply(this, [this.material, this.texture].concat(Array.prototype.slice.call(arguments, 0)));
}

function sprite(id) {
    var f = _textures.createFrame(id);
    return new Sprite(_program.positionTexture.material(f), f);
}

exports.mCamera = mCamera;
exports.mContext = mContext;
exports.spriteNode = spriteNode;
exports.colorNode = colorNode;
exports.sprite = sprite;