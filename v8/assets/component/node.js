var _Element = require('component/element.js');
var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _vec3f = _geometry.vec3f;
var _matrix4 = _geometry.matrix4;
var _inherit = require('core/inherit.js');

var aixz = new _vec3f(0, 0, 1);

/**
 * an objec with given position
 *
 * @constructor
 */
function Node() {
    _Element.call(this);

    // these vector should rener be removed or replace
    this.mAnthor = new _vec3f();// anthor point in percent
    this.mCenter = new _vec3f();// center in size(absoult) coordinate
    this.mSize = new _vec3f();// width height depth
    this.mOffset = new _vec3f();
    this.mPosition = new _vec3f();
    this.mScale = new _vec3f(1, 1, 1);
    this.mMatrix = new _matrix4();
    this.mRotate = 0;

    this.mDirty = true;
    this.mVisiable = true;
    this.mParent = null;
}
_inherit(Node, _Element);
Node.prototype.mTag = 'node';
Node.prototype.setUiNode = function (isUi) {
    this.__isUiNode = isUi;
}
Node.prototype.setRotate = function (r) {
    this.mRotate = r;
    this.mDirty = true;
}
Node.prototype.visiable = function () {
    if (arguments.length > 0) {
        this.mVisiable = arguments[0];
        return this;
    }
    return this.mVisiable;
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
Node.prototype.translate = function (offset) {
    this.mPosition.add(offset);
    this.mDirty = true;
}
Node.prototype.getPosition = function () {
    return this.mPosition;
}
Node.prototype.setAnthor = function (ax, ay) {
    if (arguments.length == 1) {
        this.mAnthor.set(ax);
    } else {
        this.mAnthor[0] = ax;
        this.mAnthor[1] = ay;
    }
    this.updateOffset();
}
Node.prototype.setSize = function (w, h) {
    if (arguments.length == 1) {
        this.mSize.set(w);
    } else {
        this.mSize[0] = w;
        this.mSize[1] = h;
    }
    this.updateOffset();
}
Node.prototype.getSize = function () {
    return this.mSize;
}
Node.prototype.setCenter = function (cx, cy) {
    if (arguments.length == 1) {
        this.mCenter.set(cx);
    } else {
        this.mCenter[0] = cx;
        this.mCenter[1] = cy;
    }
    this.updateOffset();
}
Node.prototype.updateOffset = function () {
    this.mOffset.set(
        this.mCenter[0] - this.mAnthor[0] * this.mSize[0],
        this.mCenter[1] - this.mAnthor[1] * this.mSize[1]
    );
}
Node.prototype.width = function () {
    return this.mSize[0];
}
Node.prototype.height = function () {
    return this.mSize[1];
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
    //m.identity();
    //m.translate(this.mPosition);
    //m.rotate(this.mRotate, aixz);
    //m.scale(this.mScale);
    //m.translate(this.mOffset);
    _glm.nodeMatrix(m, this.mPosition, this.mRotate, this.mScale, this.mOffset);
    //console.log('___getMatrix', this.mTag, m, this.mPosition, this.mRotate, this.mScale, this.mOffset);
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
    return _getMatrix.call(this, m || new _geometry.matrix4());
}
Node.prototype.draw = function (context) {
}

module.exports = Node;

