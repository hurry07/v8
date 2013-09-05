var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _vec3f = _geometry.vec3f;

function Camera() {
    this.mModelViewMatrix = new _geometry.matrix4();
    this.mProjectMatrix = new _geometry.matrix4();
    this.mProjectModelViewMatirx = new _geometry.matrix4();
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
    _glm.mulMM(this.mProjectModelViewMatirx, this.mProjectMatrix, this.mModelViewMatrix);
}
Camera.prototype.pvmMatirx = function() {
    return this.mProjectModelViewMatirx;
}

exports.createCamera = function () {
    return new Camera();
}