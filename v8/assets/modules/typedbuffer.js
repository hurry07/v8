var clz = require('nativeclasses');
var gl = require('opengl');
var math3d = require('core/math3d.js');

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
    if(this.mIsVbo) {
        this.mVboId = gl.createBuffer();
    }

//    console.log('this.mVboId', this.mVboId);
    this.mCursor = 0;
};
glBuffer.prototype.getElement = function (index, element) {
    if(this.mStride == 1 && !element && !this.mElement) {
        return this.mBuffer[index];
    }
    this.mBuffer.get(element || (element = this.mElement ? new this.mElement() : new this.mType(this.mStride)), index * this.mStride);
    return element;
};
glBuffer.prototype.setElement = function (index, value) {
    this.mBuffer.set(value, index * this.mStride);
};
glBuffer.prototype.clone = function () {
    return new glBuffer({
        stride : this.mStride,
        count : this.mCount,
        type : this.mType,
        gltype : this.mGLtype,
        element : this.mElement,
        normalize : this.mNormalize,
        buffer : new this.mType(this.mBuffer.buffer.slice(0))
    });
}
glBuffer.prototype.push = function (value) {
    this.setElement(this.mCursor++, value);
};
glBuffer.prototype.cursor = function() {
    if(arguments.length == 0) {
        return this.mCursor;
    }
    this.mCursor = arguments[0];
}
glBuffer.prototype.__defineGetter__('length', function () {
    return this.mCount;
});
glBuffer.prototype.buffer = function() {
    return this.mBuffer;
}
/**
 * regenerate a vbo id
 */
glBuffer.prototype.reload = function() {
    if(this.mIsVbo) {
        this.mVboId = gl.createBuffer();
    }
}
/**
 * vbo should load as your need
 */
glBuffer.prototype.upload = function() {
    if(this.mIsVbo) {
        gl.bindBuffer(this.mTarget, this.mVboId);
        gl.bufferData(this.mTarget, this.mBuffer, gl.STATIC_DRAW);
    }
}
/**
 * make this vbo the current buffer.
 */
glBuffer.prototype.bindBuffer = function() {
    gl.bindBuffer(this.mTarget, this.mVboId);
}
/**
 * util method
 * bind this.mBuffer as an vertex variable
 *
 * @param indx vertex index in shader
 */
glBuffer.prototype.bindVertex = function(indx) {
    gl.enableVertexAttribArray(indx);
    if(this.mIsVbo) {
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
 * create an index buffer
 * @param count triggles
 * @returns {glBuffer}
 */
function createIndexBuffer(stride, count) {
    if(arguments.length == 1) {
        count = stride;
        stride = 1;
    }
    return new glBuffer({
        stride : stride,
        count : count,
        type : Uint16Array,
        normalize : false,
        target : gl.ELEMENT_ARRAY_BUFFER
    });
}
function createVectorBuffer(stride, count) {
    return new glBuffer({
        stride : stride,
        count : count,
        type : Float32Array,
        element : math3d['vector' + stride],
        normalize : false
    });
}
function createBuffer(config) {
    return new glBuffer(config);
}

exports.createBuffer = createBuffer;
exports.createVectorBuffer = createVectorBuffer;
exports.createIndexBuffer = createIndexBuffer;
