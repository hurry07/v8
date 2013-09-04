var _buffers = require('glcore/buffers.js');
var glBuffer = _buffers.glBuffer;
var _struct = require('glcore/struct.js');
var gl = require('opengl');
var inherit = require('core/inherit.js');

var meshDB = {};

/**
 * as interface
 * mesh {
 *     bytestride,
 *     isVbo
 *     buffer
 *     mode
 * }
 * @param elementClz
 * @param count
 */
function meshBuffer(elementClz, count, mode) {
    this.mClass = elementClz;
    this.mAdapter = new elementClz();
    this.bytestride = elementClz.prototype.byteLength;// element bytes count
    this.mCursor = 0;

    glBuffer.call(this, {
        stride: elementClz.prototype.byteLength,
        count: count,
        type: Int8Array,
        normalize: false
    });
    this.mFields = this.mAdapter.fields();
    this.mode = mode;
}
inherit(meshBuffer, glBuffer);
/**
 * return an accessor of specific name
 *
 * @param name
 * @returns {*}
 */
meshBuffer.prototype.accessor = function (name) {
    return this.mFields[name];
}
/**
 * set cursor
 *
 * @param c
 * @returns {number}
 */
meshBuffer.prototype.cursor = function (c) {
    this.mCursor = c;
    return this;
}
/**
 * set current mesh point with data in crate sequence
 */
meshBuffer.prototype.set = function () {
    for (var i = 0, fields = this.mAdapter.arrayAccess, l = fields.length; i < l; i++) {
        var f = this.mFields[i];
        f.set.call(f, arguments[i]);
    }
    glBuffer.prototype.setElement.call(this, this.mCursor, this.mAdapter.buffer());
};
/**
 * upload data form adapter to underlying framebuffer
 * @param cursor
 */
meshBuffer.prototype.push = function (cursor) {
    if (arguments.length == 0) {
        cursor = this.mCursor;
    }
    glBuffer.prototype.setElement.call(this, cursor, this.mAdapter.buffer());
}
/**
 * copy data from framebuffer to adapter
 * @param cursor
 */
meshBuffer.prototype.pull = function (cursor) {
    if (arguments.length == 0) {
        cursor = this.mCursor;
    }
    glBuffer.prototype.getElement.call(this, cursor, this.mAdapter.buffer());
}
meshBuffer.prototype.copy = function (from, to, length) {
    if (arguments.length == 2) {
        length = 1;
    }
    var sget = glBuffer.prototype.getElement;
    var sset = glBuffer.prototype.setElement;
    var b = this.mAdapter.buffer();
    for (var i = 0; i < length; i++) {
        sget.call(this, from + i, b);
        sset.call(this, to + i, b);
    }
}
/**
 * bind buffer
 * @param locs
 */
meshBuffer.prototype.bindVertex = function (locs) {
    if (this.mIsVbo) {
        gl.bindBuffer(this.mTarget, this.mVboId);
    }

    var confs = this.mClass.prototype.arrayAccess;
    for (var i = 0, l = locs.length; i < l; i++) {
        confs[i].bindVertex(this, locs[i]);
    }
}
function setupMesh(protocal) {
    var builder = _struct.createStruct();
    var arr = protocal.match(/\w\d*/g);

    for (var i = 0, l = arr.length; i < l; i++) {
        var stride = arr[i].length > 1 ? arr[i].slice(1) : 0;
        switch (arr[i].charAt(0)) {
            case 't':
                builder.add('t', Float32Array, stride || 2);// texture
                break;
            case 'p':
                builder.add('p', Float32Array, stride || 2);// position
                break;
            case 'c':
                builder.add('c', Float32Array, stride || 4);// color
                break;
            case 'n':
                builder.add('n', Float32Array, stride || 3);// normalize
                break;
            default :
                console.log('mesh key type:[' + arr[i].charAt(0) + '] not found');
                break;
        }
    }

    return builder.createClass();
}

/**
 *
 * @param {string} protocal mesh field protocal
 * @param {number} points point count
 * @returns {meshBuffer}
 */
function createMesh(protocal, points) {
    var clz = meshDB[protocal] || (meshDB[protocal] = setupMesh(protocal));
    return new meshBuffer(clz, points);
}

exports.createMesh = createMesh;