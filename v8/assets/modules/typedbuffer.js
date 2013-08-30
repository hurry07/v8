var clz = require('nativeclasses');
var gl = require('opengl');
var math3d = require('core/math3d.js');
var inherit = require('core/inherit.js');

var supportVbo = false;
/**
 * glBuffer manages a TypedArray as an array of vectors.
 * @param config {
 *     elementsize 1,2,3,4
 *     gltype one of GL_BYTE,GL_UNSIGNED_BYTE,GL_SHORT,GL_UNSIGNED_SHORT,GL_FIXED,GL_FLOAT
 *     type buffer's class type, use
 *     element, auto wrap raw value of getElement
 *     buffer, data buffer object used
 * }
 */
function glBuffer(config) {
    // require
    this.mStride = config.stride;
    this.mCount = config.count;

    // optional
    this.mType = config && config.type || Float32Array;
    this.mGLtype = config && config.gltype || getGLType(this.mType);
    this.mElement = config && config.element;
    this.mNormalize = config && config.normalize || false;
    this.mBuffer = config.buffer || new this.mType(this.mStride * this.mCount);
    this.mTarget = config && config.target || gl.ARRAY_BUFFER;

    this.mIsVbo = config && config.isvbo || true;
    this.mVboId = 0;
    if (this.mIsVbo) {
        this.mVboId = gl.createBuffer();
    }

//    console.log('this.mVboId', this.mVboId);
    this.mCursor = 0;
};
glBuffer.prototype.getElement = function (index, element) {
    this.mBuffer.get(element || (element = this.mElement ? new this.mElement() : new this.mType(this.mStride)), index * this.mStride);
    return element;
};
glBuffer.prototype.setElement = function (index, value) {
    this.mBuffer.set(value, index * this.mStride);
};
glBuffer.prototype.clone = function () {
    return new glBuffer({
        stride: this.mStride,
        count: this.mCount,
        type: this.mType,
        gltype: this.mGLtype,
        element: this.mElement,
        normalize: this.mNormalize,
        buffer: new this.mType(this.mBuffer.buffer.slice(0))
    });
}
glBuffer.prototype.push = function (value) {
    this.setElement(this.mCursor++, value);
};
glBuffer.prototype.cursor = function () {
    if (arguments.length == 0) {
        return this.mCursor;
    }
    this.mCursor = arguments[0];
}
glBuffer.prototype.__defineGetter__('length', function () {
    return this.mCount;
});
/**
 * return inner buffer
 * @returns {*}
 */
glBuffer.prototype.buffer = function () {
    return this.mBuffer;
}
/**
 * regenerate a vbo id
 */
glBuffer.prototype.reload = function () {
    if (this.mIsVbo) {
        this.mVboId = gl.createBuffer();
    }
}
/**
 * vbo should load as your need
 */
glBuffer.prototype.upload = function () {
    if (this.mIsVbo) {
        gl.bindBuffer(this.mTarget, this.mVboId);
        gl.bufferData(this.mTarget, this.mBuffer, gl.STATIC_DRAW);
    }
}
/**
 * make this vbo the current buffer.
 */
glBuffer.prototype.bindBuffer = function () {
    gl.bindBuffer(this.mTarget, this.mVboId);
}
/**
 * util method
 * bind this.mBuffer as an vertex variable
 *
 * @param indx vertex index in shader
 */
glBuffer.prototype.bindVertex = function (indx) {
    gl.enableVertexAttribArray(indx);
    if (this.mIsVbo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mVboId);
        gl.vertexAttribPointer(indx, this.mStride, this.mGLtype, this.mNormalize, 0, 0);
    } else {
        gl.vertexAttribPointer(indx, this.mStride, this.mGLtype, this.mNormalize, 0, this.mBuffer);
    }
}
function getGLType(type) {
    if (type === Float32Array) {
        return gl.FLOAT;
    } else if (type === Uint8Array) {
        return gl.UNSIGNED_BYTE;// 数据类型
    } else if (type === Int8Array) {
        return gl.BYTE;// 数据类型
    } else if (type === Uint16Array) {
        return gl.UNSIGNED_SHORT;
    } else if (type === Int16Array) {
        return gl.SHORT;
    } else {
        throw("unhandled type:" + type);
    }
}

/**
 * create a mix buffer element, each part of the buffer will be treated as a mix structor
 *
 * @param stride
 * @param count count of elment
 * @param element type of element
 */
function mixBuffer(stride, count, element) {
    this.mixElement = element;
    glBuffer.call(this, {
        stride: stride,
        count: count,
        type: Int8Array,
        normalize: false
    });
}
inherit(mixBuffer, glBuffer);
mixBuffer.prototype.getElement = function (index, element) {
    element = element || new this.mixElement;
    glBuffer.prototype.getElement.call(this, index, element.buffer());
    return element;
};
mixBuffer.prototype.setElement = function (index, value) {
    glBuffer.prototype.setElement.call(this, index, value.buffer());
};

/**
 * use as super class of anonymous class of instance
 */
function structSuper() {
    var mBuffer = new ArrayBuffer(this.byteLength);
    var bufAccess = this.bufAccess;
    var mSubBuffer = {};
    for (var i in bufAccess) {
        var p = bufAccess[i];
        mSubBuffer[i] = new p.type(mBuffer, p.byteOffset, p.size);
    }

    this.mSubBuffer = mSubBuffer;
    this.mBuffer = mBuffer;
}
structSuper.prototype.set = function (name, value) {
    var f = this.mSubBuffer[name];
    f && (arguments.length == 2 ? f.set(value) : f.set.apply(f, Array.prototype.slice.call(arguments, 1)));
}
structSuper.prototype.get = function (name) {
    return this.mSubBuffer[name];
}
structSuper.prototype.buffer = function () {
    return this.mBuffer;
}

/**
 * unit of a mix buffer
 *
 * @param byteLength
 * @param parts
 */
function structInst(byteLength, bufAccess) {
    this.byteLength = byteLength;
    this.bufAccess = bufAccess;
    structSuper.call(this);
}
inherit(structInst, structSuper);

/**
 * helper class of creating a mix buffer structor
 */
function structBuilder() {
    this.parts = [];
}
/**
 *
 * @param name
 * @param type the container type
 * @param size
 * @returns {*}
 */
structBuilder.prototype.add = function (name, type, size) {
    if (arguments.length == 2) {
        this.parts.push({type: name, size: type});
    } else {
        this.parts.push({name: name, type: type, size: size});
    }
    return this;
}
structBuilder.prototype.createBufMap = function (bufAccess) {
    var byteLength = 0;
    for (var i = 0, ps = this.parts, length = ps.length; i < length; i++) {
        var p = ps[i];
        p.byteOffset = byteLength;
        switch (p.type) {
            case Uint8Array:
            case Int8Array:
                p.byteLength = ps[i].size;
                break;
            case Uint16Array:
            case Int16Array:
                p.byteLength = 2 * ps[i].size;
                break;
            case Uint32Array:
            case Int32Array:
            case Float32Array:
                p.byteLength = 4 * ps[i].size;
                break;
            case Float64Array:
                p.byteLength = 8 * ps[i].size;
                break;
        }
        bufAccess[p.name || i] = p;
        byteLength += p.byteLength;
    }
    return byteLength;
}
/**
 * create an instance of current class, you must hold this refer for futher use.
 * @returns {structInst}
 */
structBuilder.prototype.create = function () {
    var bufAccess = {};
    var byteLength = this.createBufMap(bufAccess);
    return new structInst(byteLength, bufAccess);
}
/**
 * return a class of this mix buffer
 * @returns {*}
 */
structBuilder.prototype.createClass = function () {
    var bufAccess = {};
    var byteLength = this.createBufMap(bufAccess);
    var clz = inherit(
        function () {
            structSuper.call(this);
        }, structSuper, {
            byteLength: byteLength,
            bufAccess: bufAccess
        }
    );
    clz.createBuffer = function(count) {
        if(arguments.length == 0) {
            count = 1;
        }
        return new mixBuffer(byteLength, count, clz);
    }
    return clz;
}
structBuilder.prototype.createBuffer = function(count) {
    return this.createClass().createBuffer.apply(this, arguments);
}

/**
 * create an index buffer
 * @param count triggles
 * @returns {glBuffer}
 */
function createIndexBuffer(stride, count) {
    if (arguments.length == 1) {
        count = stride;
        stride = 1;
    }
    return new glBuffer({
        stride: stride,
        count: count,
        type: Uint16Array,
        normalize: false,
        target: gl.ELEMENT_ARRAY_BUFFER
    });
}
function createVectorBuffer(stride, count) {
    return new glBuffer({
        stride: stride,
        count: count,
        type: Float32Array,
        element: math3d['vector' + stride],
        normalize: false
    });
}
function createBuffer(config) {
    return new glBuffer(config);
}
/**
 * help you creating a structure
 * @param count
 * @param element
 * @returns {mixBuffer}
 */
function createMixBuffer(stride, count, element) {
    return new mixBuffer(stride, count, element);
}
function structure() {
    return new structBuilder();
}

exports.createBuffer = createBuffer;
exports.createVectorBuffer = createVectorBuffer;
exports.createIndexBuffer = createIndexBuffer;
exports.createMixBuffer = createMixBuffer;
exports.structure = structure;
