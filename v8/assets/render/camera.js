var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _vec3f = _geometry.vec3f;
var _gl = require('opengl');

function Camera() {
    this.mModelViewMatrix = new _geometry.matrix4();
    this.mProjectMatrix = new _geometry.matrix4();
    this.mProjectModelViewMatirx = new _geometry.matrix4();
    this.mDirty = true;
    this.setViewport(0, 0, 1, 1);
}
Camera.prototype.viewport = function () {
    _gl.viewport(this.x, this.y, this.width, this.height);
}
Camera.prototype.setViewport = function (x, y, width, height) {
    if (arguments.length == 2) {
        this.x = 0;
        this.y = 0;
        this.width = x;
        this.height = y;
    } else {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
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
    _glm.mulMM(this.mProjectModelViewMatirx, this.mProjectMatrix, this.mModelViewMatrix);
}
Camera.prototype.pvmMatirx = function () {
    return this.mProjectModelViewMatirx;
}
Camera.prototype.isDirty = function () {
    return this.mDirty;
}
Camera.prototype.clean = function () {
    this.mDirty = false;
}

exports.createCamera = function () {
    return new Camera();
}