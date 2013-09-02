var buffers = require('glcore/buffers.js');
var glBuffer = buffers.glBuffer;
var inherit = require('core/inherit.js');
var gl = require('opengl');

var meshDB = {};

function meshBuffer(elementClz, count) {
    this.mClass = elementClz;
    this.mAdapter = new elementClz();
    this.mCursor = 0;

    buffers.glBuffer.call(this, {
        stride: elementClz.prototype.byteLength,
        count: count,
        type: Int8Array,
        normalize: false
    });
    this.mFields = this.mAdapter.fields();
}
inherit(meshBuffer, buffers.glBuffer);
/**
 * cursor.set, cursor.get
 *
 * @param index
 * @returns {*}
 */
meshBuffer.prototype.cursor = function (index) {
    this.mCursor = index;
    return this;
};
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
 * if arguments was given, fill fields one by one
 */
meshBuffer.prototype.set = function () {
    for (var i = 0, fields = this.mAdapter.arrayAccess, l = fields.length; i < l; i++) {
        var f = this.mFields[i];
        f.set.call(f, arguments[i]);
    }
    glBuffer.prototype.setElement.call(this, this.mCursor, this.mAdapter.buffer());
};
meshBuffer.prototype.copy = function (from, to, length) {
    if(arguments.length == 2) {
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
meshBuffer.prototype.bindVertex = function (locs) {
    var stride = this.mClass.prototype.byteLength;
    var confs = this.mClass.prototype.arrayAccess;
    var buf = this.buffer();

    if (this.mIsVbo) {
        gl.bindBuffer(this.mTarget, this.mVboId);
    }
    for (var i = 0, l = locs.length; i < l; i++) {
        var f = confs[i];
        gl.enableVertexAttribArray(locs[i]);
        if(this.mIsVbo) {
            gl.vertexAttribPointer(locs[i], f.size, f.glType, this.mNormalize, stride, f.byteOffset);
        } else {
            gl.vertexAttribPointer(locs[i], f.size, f.glType, this.mNormalize, stride, buf.subarray(f.byteOffset));
        }
    }
}
/**
 * @param order mesh field order
 * @param points
 * @returns {meshBuffer}
 */
function createMesh(order, points) {
    var clz = meshDB[order];
    if (clz) {
        return new meshBuffer(clz, points);
    }

    clz = buffers.structure();
    var arr = order.match(/\w\d*/g);
    for (var i = 0, l = arr.length; i < l; i++) {
        var stride = arr[i].length > 1 ? arr[i].slice(1) : 0;
        switch (arr[i].charAt(0)) {
            case 't':
                clz.add('t', Float32Array, stride || 2);// texture
                break;
            case 'p':
                clz.add('p', Float32Array, stride || 3);// position
                break;
            case 'c':
                clz.add('c', Float32Array, stride || 4);// color
                break;
            case 'n':
                clz.add('n', Float32Array, stride || 3);// normalize
                break;
            default :
                console.log('mesh key type:[' + order.charAt(i) + '] not found');
                break;
        }
    }

    clz = clz.createClass();
    meshDB[order] = clz;
    return new meshBuffer(clz, points);
}
exports.createMesh = createMesh;