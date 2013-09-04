var clz = require('nativeclasses');
var gl = require('opengl');
var glm = require('core/glm.js');
var inherit = require('core/inherit.js');
var getGLType = require('glcore/utils.js').getGLType;

var supportVbo = true;

function glBuffer(config) {
    // require
    this.mStride = config.stride;// field in one buffer unit
    this.mCount = config.count;

    // optional
    this.mType = config && config.type || Float32Array;
    this.mGLtype = config && config.gltype || getGLType(this.mType);
    this.mElement = config && config.element;
    this.mNormalize = config && config.normalize || false;
    this.mBuffer = config.buffer || new this.mType(this.mStride * this.mCount);
    this.mTarget = config && config.target || gl.ARRAY_BUFFER;

    this.mIsVbo = config && config.isvbo || supportVbo;
    this.mVboId = 0;
    if (this.mIsVbo) {
        this.mVboId = gl.createBuffer();
    }
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
    } else {
        gl.bindBuffer(this.mTarget, this.mBuffer);
    }
}
/**
 * make this vbo the current buffer.
 */
glBuffer.prototype.bindBuffer = function () {
    if (this.mIsVbo) {
        gl.bindBuffer(this.mTarget, this.mVboId);
    }
}
glBuffer.prototype.isVbo = function() {
    return this.mIsVbo;
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
        gl.bindBuffer(this.mTarget, this.mVboId);
        gl.vertexAttribPointer(indx, this.mStride, this.mGLtype, this.mNormalize, 0, 0);
    } else {
        gl.vertexAttribPointer(indx, this.mStride, this.mGLtype, this.mNormalize, 0, this.mBuffer);
    }
}
glBuffer.prototype.target = function () {
    if (arguments.length == 0) {
        return this.mTarget;
    }
    this.mTarget = arguments[0];
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
/**
 * create vector buffer
 *
 * @param stride
 * @param count
 * @returns {glBuffer}
 */
function createVectorBuffer(stride, count) {
    return new glBuffer({
        stride: stride,
        count: count,
        type: Float32Array,
        element: glm['vector' + stride],
        normalize: false
    });
}
/**
 * create an structor with given element type
 * @param config
 * @returns {glBuffer}
 */
function createBuffer(config) {
    return new glBuffer(config);
}

/**
 * set the default behaivour of all buffers
 */
exports.enableVBO = function () {
    supportVbo = true;
}
exports.disableVBO = function () {
    supportVbo = false;
}

exports.glBuffer = glBuffer;
exports.createBuffer = createBuffer;
exports.createVectorBuffer = createVectorBuffer;
exports.createIndexBuffer = createIndexBuffer;
