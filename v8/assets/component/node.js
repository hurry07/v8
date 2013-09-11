var _Element = require('component/element.js');
var geometry = require('core/glm.js');
var glm = geometry.glm;
var aixz = new geometry.vec3f(0, 0, 1);
var _inherit = require('core/inherit.js');

/**
 * an objec with given position
 *
 * @constructor
 */
function Node() {
    _Element.call(this);

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
    this.mMatrix = new geometry.matrix4();
    this.mDirty = true;
}
_inherit(Node, _Element);
Node.prototype.mTag = 'node';
Node.prototype.setRotate = function (r) {
    this.mRotate = r;
    this.mDirty = true;
}
Node.prototype.getRotate = function (r) {
    return this.mRotate;
}
Node.prototype.setPosition = function (x, y) {
    if (arguments.length == 1) {
        this.mPosition.set(x);
    } else {
        this.mPosition[0] = x;
        this.mPosition[1] = y;
    }
    this.mDirty = true;
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
Node.prototype.setSize = function (w, h) {
    this.mWidth = w;
    this.mHeight = h;
    this.updateOffset();
}
Node.prototype.width = function () {
    return this.mWidth;
}
Node.prototype.height = function () {
    return this.mHeight;
}
Node.prototype.setCenter = function (cx, cy) {
    this.mCenterX = cx;
    this.mCenterY = cy;
    this.updateOffset();
}
Node.prototype.updateOffset = function () {
    this.mOffset.set(
        -(this.mAnthorX - this.mCenterX) * this.mWidth,
        -(this.mAnthorY - this.mCenterY) * this.mHeight
    );
}
Node.prototype.setScale = function (sx, sy) {
    if (arguments.length == 1) {
        this.mScale[0] = this.mScale[1] = sx;
    } else {
        this.mScale[0] = sx;
        this.mScale[1] = sy;
    }
    this.mDirty = true;
}

function _getMatrix(m) {
    // translate, rotate, scale
    m.identity();
    m.translate(this.mPosition);
    m.rotate(this.mRotate, aixz);
    m.scale(this.mScale);
    m.translate(this.mOffset);
    return m;
}
/**
 * @returns {boolean} whether or not this node is updated
 */
Node.prototype.updateMatrix = function () {
    if (!this.mDirty) {
        return false;
    }
    _getMatrix.call(this, this.mMatrix);
    this.mDirty = false;
    return true;
}
Node.prototype.getMatrix = function (m) {
    return _getMatrix.call(this, m || new geometry.matrix4());
}
Node.prototype.draw = function (context) {
}

module.exports = Node;

