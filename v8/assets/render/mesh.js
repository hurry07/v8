var buffers = require('glcore/buffers.js');
var glBuffer = buffers.glBuffer;
var inherit = require('core/inherit.js');

var meshDB = {};

function meshBuffer(elementClz, count) {
    this.mAdapter = new elementClz();
    this.mCursor = 0;
    buffers.glBuffer.call(this, {
        stride: elementClz.byteLength,
        count: count,
        type: Int8Array,
        normalize: false
    });
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
 * if arguments was given, fill fields one by one
 */
meshBuffer.prototype.set = function () {
    if (arguments.length) {
        var a = this.mAdapter;
        for (var i = 0, fields = a.arrayAccess, l = fields.length; i < l; i++) {
            fields[i].set.call(a, arguments[i]);
        }
    }
    glBuffer.prototype.setElement.call(this, this.mCursor, this.mAdapter.buffer());
};
meshBuffer.prototype.get = function () {
    glBuffer.prototype.getElement.call(this, this.mCursor, this.mAdapter.buffer());
    return this.mAdapter;
};
meshBuffer.prototype.copy = function (from, to, length) {
    var sget = glBuffer.prototype.getElement;
    var sset = glBuffer.prototype.setElement;
    var b = this.mAdapter.buffer();
    for (var i = 0; i < length; i++) {
        sget.call(this, from + i, b);
        sset.call(this, to + i, b);
    }
}
meshBuffer.prototype.setField = function (name, value) {
    var a = this.mAdapter;
    var b = a.buffer();
    var f;
    if (f = a.field(name)) {
        f.set.apply(f, Array.prototype.slice.call(arguments, 1));
        glBuffer.prototype.setElement.call(this, this.mCursor, b);
    }
}
meshBuffer.prototype.setFieldAt = function (index, value) {
    var a = this.mAdapter;
    var b = a.buffer();
    var f;
    if (f = a.fieldAt(index)) {
        f.set.apply(f, Array.prototype.slice.call(arguments, 1));
        glBuffer.prototype.setElement.call(this, this.mCursor, b);
    }
}
meshBuffer.prototype.bindAttrib = function (name, loc) {
    console.log('this.mVboId:' + this.mVboId);
    console.log('this.mStride:' + this.mStride);
//    gl.enableVertexAttribArray(loc);
//    if (this.mIsVbo) {
//        gl.bindBuffer(this.mTarget, this.mVboId);
//        gl.vertexAttribPointer(loc, this.mStride, this.mGLtype, this.mNormalize, 0, 0);
//    } else {
//        gl.vertexAttribPointer(loc, this.mStride, this.mGLtype, this.mNormalize, 0, this.mBuffer);
//    }
}

/**
 * @param order mesh field order
 * @param count
 * @returns {meshBuffer}
 */
function createMesh(order, count) {
    var clz = meshDB[order];
    if (clz) {
        return new meshBuffer(clz, count);
    }
    clz = buffers.structure();
    for (var i = 0, l = order.length; i < l; i++) {
        switch (order.charAt(i)) {
            case 't':
                clz.add('t', Float32Array, 2);
            case 'p':
                clz.add('p', Float32Array, 3);
            case 'c':
                clz.add('c', Float32Array, 4);
            case 'n':
                clz.add('n', Float32Array, 3);
        }
    }
    clz = clz.createClass();
    meshDB[order] = clz;
    return new meshBuffer(clz, count);
}
exports.createMesh = createMesh;