var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _vec3f = _geometry.vec3f;
var _gl = require('opengl');

function Camera() {
    this.mModelViewMatrix = new _geometry.matrix4();
    this.mProjectMatrix = new _geometry.matrix4();
    this.mProjectModelViewMatirx = new _geometry.matrix4();
    this.mTouchMatrix = new _geometry.matrix4();
    this.mDirty = true;
    this.mTimestamp = 0;
    this.setViewport(0, 0, 1, 1);
    this.mProjectParam = {
        left: 0,
        right: 1,
        buttom: 0,
        top: 1,
        near: 1,
        far: 2
    };
    this.mViewportParam = {
        x: 0,
        y: 0,
        width: 1,
        height: 1
    }
}
Camera.prototype.viewport = function () {
    var p = this.mViewportParam;
    _gl.viewport(p.x, p.y, p.width, p.height);
}
Camera.prototype.setViewport = function (x, y, width, height) {
    if (arguments.length == 2) {
        this.mViewportParam = {
            x: 0,
            y: 0,
            width: x,
            height: y
        }
    } else {
        this.mViewportParam = {
            x: x,
            y: y,
            width: width,
            height: height
        }
    }
    this.updatePVM();
}

// ========================================================
// modelview
// ========================================================
Camera.prototype.lookAt = function (eye, center, up) {
    this.mModelViewMatrix.identity();
    _glm.lookAt(this.mModelViewMatrix, new _vec3f(eye), new _vec3f(center), new _vec3f(up));
    this.updatePVM();
    return this;
}

// ========================================================
// projection
// ========================================================
Camera.prototype.frustum = function (left, right, bottom, top, near, far) {
    this.mProjectMatrix.identity();
    _glm.ortho.frustum(this, [this.mProjectMatrix].concat(Array.prototype.splice.call(arguments, 0)));
    this.updatePVM();
    return this;
}
Camera.prototype.ortho = function (left, right, bottom, top, near, far) {
    this.mProjectParam = {
        left: left,
        right: right,
        buttom: bottom,
        top: top,
        near: near,
        far: far
    };
    this.mProjectMatrix.identity();
    _glm.ortho.apply(this, [this.mProjectMatrix].concat(Array.prototype.splice.call(arguments, 0)));
    this.updatePVM();
    return this;
}
Camera.prototype.perspective = function (fovy, aspect, zNear, zFar) {
    this.mProjectMatrix.identity();
    _glm.perspective(this.mProjectMatrix, fovy, aspect, zNear, zFar);
    this.updatePVM();
    return this;
}

Camera.prototype.updatePVM = function () {
    this.mDirty = true;
    this.mTimestamp = new Date().getTime();
    _glm.mulMM(this.mProjectModelViewMatirx, this.mProjectMatrix, this.mModelViewMatrix);

    var paramP = this.mViewportParam;
    this.mTouchMatrix.identity();
    this.mTouchMatrix.scale(new _vec3f(1, -1, 1));
    this.mTouchMatrix.translate(new _vec3f(0, -paramP.height, 0));
}
Camera.prototype.pvmMatirx = function () {
    return this.mProjectModelViewMatirx;
}
Camera.prototype.modelViewMatrix = function () {
    return this.mModelViewMatrix;
}
Camera.prototype.isDirty = function () {
    return this.mDirty;
}
Camera.prototype.clean = function () {
    this.mDirty = false;
}

Camera.prototype.updateTouchMatrix = function (inverse, model) {
    _glm.mulMM(inverse, this.mModelViewMatrix, model);
    inverse.inverse();
    _glm.mulMM(inverse, inverse, this.mTouchMatrix);
}

exports.createCamera = function () {
    return new Camera();
}