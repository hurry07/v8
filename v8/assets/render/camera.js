var geometry = require('core/glm.js');
var glm = geometry.glm;

function Camera() {
    this.mModelViewMatrix = new geometry.matrix4();
    this.mProjectMatrix = new geometry.matrix4();
    this.mProjectModelViewMatirx = new geometry.matrix4();
}
Camera.prototype.lookAt = function (eye, center, up) {
    this.mModelViewMatrix.identity();
    glm.lookAt(this.mModelViewMatrix, new geometry.vec3f(eye), new geometry.vec3f(center), new geometry.vec3f(up));
    this.updatePMV();
    return this;
}
Camera.prototype.frustum = function (left, right, bottom, top, near, far) {
    this.mProjectMatrix.identity();
    glm.ortho.frustum(this, [this.mProjectMatrix].concat(Array.prototype.splice.call(arguments, 0)));
    this.updatePMV();
    return this;
}
Camera.prototype.ortho = function (left, right, bottom, top, near, far) {
    this.mProjectMatrix.identity();
    glm.ortho.apply(this, [this.mProjectMatrix].concat(Array.prototype.splice.call(arguments, 0)));
    this.updatePMV();
    return this;
}
Camera.prototype.perspective = function (fovy, aspect, zNear, zFar) {
    this.mProjectMatrix.identity();
    glm.perspective(this.mProjectMatrix, fovy, aspect, zNear, zFar);
    this.updatePMV();
    return this;
}
Camera.prototype.updatePMV = function () {
    glm.mulMM(this.mProjectModelViewMatirx, this.mProjectMatrix, this.mModelViewMatrix);
}
Camera.prototype.pvmMatirx = function() {
    return this.mProjectModelViewMatirx;
}

exports.createCamera = function () {
    return new Camera();
}