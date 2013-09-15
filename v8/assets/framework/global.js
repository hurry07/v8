var _gl = require('opengl');
var _textures = require('framework/texture.js');
var _program = require('framework/program.js');
var _Context = require('render/drawcontext.js');
var _Camera = require('render/camera.js');
var _UpdateContext = require('render/updatecontext.js');
var _TouchContext = require('render/touchcontext.js');

var _Sprite = require('drawable/spritenode.js');
var _9Patch = require('drawable/ninepatch.js');
var _Color = require('drawable/colornode.js');

var _NamedList = require('core/namedlist.js');

// ==============================================
// keep all global variables
// ==============================================
var mCamera = _Camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(0, 1, 0, 1, 9, 11);
var mRenderContext = new _Context(mCamera);
exports.mCamera = mCamera;
exports.mRenderContext = mRenderContext;

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

var mTasks = [];
function Task(fn, bind) {
    this.fn = fn;
    this.bind = bind || this;
}
Task.prototype.run = function () {
    this.fn.call(this.bind);
}

exports.scheduleTask = function (fn, bind) {
    mTasks.push(new Task(fn, bind));
}

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
exports.spriteNode = spriteNode;
exports.colorNode = colorNode;

function Schedule(namedlist) {
    this._coll = namedlist;
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

var scheduleRender = new Schedule(new _NamedList('__render__'));
var scheduleUpdate = new Schedule(new _NamedList('__update__'));
var scheduleEvent = new Schedule(new _NamedList('__event__'));// touch event currently
var sceneCollection = new Schedule(new _NamedList('__scene__'));

var updateContext = new _UpdateContext(scheduleUpdate.iterator());
var touchContext = new _TouchContext();

exports.scheduleRender = scheduleRender;
exports.scheduleUpdate = scheduleUpdate;
exports.scheduleEvent = scheduleEvent;
exports.scenes = sceneCollection;
exports.updateContext = updateContext;

exports.registerScene = function (scene) {
    scene.onRegister(exports);
    sceneCollection.schedule(scene);
};
exports.unregisterScene = function (scene) {
    scheduleRender.cancel(scene);
    scheduleUpdate.cancel(scene);
    scheduleEvent.cancel(scene);
    sceneCollection.cancel(scene);
};
exports.onSizeChange = function (width, height) {
    var itor = sceneCollection.iterator();
    while (itor.hasNext()) {
        itor.next().onSizeChange(width, height);
    }
}

var mCount = 0;
/**
 * update and draw all elements
 */
exports.runSchedule = function () {
    updateContext.ticktack();

    if (mCount++ > 200) {
        mCount = 0;
        touchContext.pullEvents();
        var event;
        while (event = touchContext.pop()) {
            console.log(event);
        }
    }

//    // touch
//    var itor = scheduleEvent.iterator();
//    while (itor.hasNext()) {
//        itor.next().onTouch(updateContext);
//    }
    // update
    var itor = scheduleUpdate.iterator();
    while (itor.hasNext()) {
        itor.next().update(updateContext);
    }
    // drawing
    _gl.clear(_gl.COLOR_BUFFER_BIT);
    var itor = scheduleRender.iterator();
    while (itor.hasNext()) {
        itor.next().draw(mRenderContext);
    }

    // run task;
    while (mTasks.length > 0) {
        mTasks.shift().run();
    }
}

/**
 * render all elements
 */
exports.renderSchedule = function () {
    // drawing
    _gl.clear(_gl.COLOR_BUFFER_BIT);
    var itor = scheduleRender.iterator();
    while (itor.hasNext()) {
        itor.next().draw(mRenderContext);
    }

    // run task;
    while (mTasks.length > 0) {
        mTasks.shift().run();
    }
}
