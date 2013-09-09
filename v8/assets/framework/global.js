var _textures = require('framework/texture.js');
var _program = require('framework/program.js');
var _Context = require('render/context.js');
var _Camera = require('render/camera.js');
var _UpdateContext = require('render/updatecontext.js');

var _Sprite = require('drawable/spritenode.js');
var _9Patch = require('drawable/ninepatch.js');
var _Color = require('drawable/colornode.js');

var _NamedList = require('core/namedlist.js');

// ==============================================
// keep all global variables
// ==============================================
var mCamera = _Camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, 1, 0, 1, 9, 11);
var mContext = new _Context(mCamera);

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
exports.sprite = sprite;

/**
 * create node
 *
 * @param id
 * @returns {_Sprite}
 */
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

var _LinkedList = require('core/linkedlist.js').LinkedList;
function Schedule(namedlist) {
    this._coll = namedlist;
    this._list = new _LinkedList('');
    this._itor = namedlist.iterator();
}
Schedule.prototype.schedule = function (obj) {
    this._coll.add(obj);
}
Schedule.prototype.cancel = function (obj) {
    this._coll.remove(obj);
}
Schedule.prototype.iterator = function () {
    this._itor.reset();
    return this._itor;
}

exports.scheduleRender = new Schedule(new _NamedList('__render__'));
exports.scheduleUpdate = new Schedule(new _NamedList('__update__'));
exports.updateContext = new _UpdateContext(exports.scheduleUpdate.iterator());

exports.registerScene = function (scene) {
    exports.scheduleRender.schedule(scene);
    exports.scheduleUpdate.schedule(scene);
};
exports.unregisterScene = function (scene) {
    exports.scheduleRender.cancel(scene);
    exports.scheduleUpdate.cancel(scene);
};

