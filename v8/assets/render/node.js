var geometry = require('core/glm.js');
var glm = geometry.glm;
var _drawable = require('render/drawable.js');
var _inherit = require('core/inherit.js');
var aixz = new geometry.vec3f(0, 0, 1);

function Node() {
    _drawable.call(this);

    // these should set internal
    this.mCenterX = 0;
    this.mCenterY = 0;
    this.mWidth = 0;
    this.mHeight = 0;

    this.mAnthorX = 0;
    this.mAnthorY = 0;
    this.mOffset = new geometry.vec3f();
    this.mPosition = new geometry.vec3f();
    this.mScale = new geometry.vec3f(1, 1, 1);
    this.mRotate = 0;
    this.mMatirx = new geometry.matrix4();
    this.mDirty = true;
}
_inherit(Node, _drawable);
Node.prototype.setRotate = function (r) {
    this.mRotate = r;
}
Node.prototype.getRotate = function (r) {
    return this.rotate;
}
Node.prototype.setPosition = function (x, y) {
    if (arguments.length == 1) {
        this.mPosition.set(x);
    } else {
        this.mPosition[0] = x;
        this.mPosition[1] = y;
    }
}
Node.prototype.setAnthor = function (ax, ay) {
    if (arguments.length == 1) {
        this.mAnthorX = this.mAnthorY = ax;
    } else {
        this.mAnthorX = ax;
        this.mAnthorY = ay;
    }
    this.updateOffset();
}
Node.prototype.setCenter = function (cx, cy) {
    this.mCenterX = cx;
    this.mCenterY = cy;
    this.updateOffset();
}
Node.prototype.setScale = function (sx, sy) {
    if (arguments.length == 1) {
        this.mScale[0] = this.mScale[1] = sx;
    } else {
        this.mScale[0] = sx;
        this.mScale[1] = sy;
    }
}
Node.prototype.updateOffset = function () {
    this.mOffset.set(
        -(this.mAnthorX - this.mCenterX) * this.mWidth,
        -(this.mAnthorY - this.mCenterY) * this.mHeight
    );
}
Node.prototype.updateMatrix = function () {
    if (!this.mDirty) {
        return;
    }
    var m = this.mMatirx;
    m.identity();
    m.translate(this.mPosition);
    m.rotate(this.mRotate, this.mRotate, aixz);
    m.scale(this.mRotate, this.mScale);
    m.translate(this.mOffset);
    this.mDirty = false;
}

module.exports = Node;
