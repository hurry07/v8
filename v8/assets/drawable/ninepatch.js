var _gl = require('opengl');
var _geometry = require('core/glm.js');
var _MeshNode = require('render/meshnode.js');
var _createMesh = require('glcore/meshbuffer.js').createMesh;
var _inherit = require('core/inherit.js');

var _glm = _geometry.glm;
var _v2 = _geometry.vec2f;
var _v3 = _geometry.vec3f;
var _order = require('glcore/constance.js').STRIP_ORDER;

/**
 * @param material
 * @param frame texture frame
 * @constructor
 */
function NinePatch(material, frame) {
    _MeshNode.call(this, this.createMesh(), material);
    this.mFrame = frame;

    this.init();
    this.setSize(frame.width(), frame.height);
}
_inherit(NinePatch, _MeshNode);
NinePatch.prototype.setSize = function (w, h) {
    _MeshNode.prototype.setSize.call(this, w, h);
    this.updateMesh();
}
NinePatch.prototype.createMesh = function () {
}
NinePatch.prototype.updateMesh = function () {
}

function Border(material, frame) {
    NinePatch.call(this, material, frame);
}
_inherit(Border, _MeshNode);
Border.prototype.init = function () {
    if (arguments.length == 0) {
        this._left = this._top = this._right = this._bottom = 0;
    } else if (arguments.length == 1) {
        this._left = this._top = this._right = this._bottom = arguments[0];
    } else if (arguments.length == 2) {
        this._left = arguments[0];
        this._right = arguments[1];
        this._top = this._bottom = 0;
    } else if (arguments.length == 4) {
        this._left = arguments[0];
        this._top = arguments[1];
        this._right = arguments[2];
        this._bottom = arguments[3];
    }
}
/**
 * x1, y1 left top
 * x2, y2 right bottom, int texture coordinate
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
Border.prototype.updateCell = function (x1, y1, x2, y2, xidx, yidx, temp) {
    var p1 = 6 * (xidx + yidx * 3);
    if (xidx > 0) {
        this.mBuffer.copy(p1 - 4, p1, 1);
    } else {
    }
}
Border.prototype.updateRow = function (x1, x2, y1, y2, xidx, yidx, temp) {
    this.updateCell(0, y1, x1, y2, xidx, yidx, temp);
    this.updateCell(x1, y1, x2, y2, xidx + 1, yidx, temp);
    this.updateCell(x2, y1, this.mWidth, y2, xidx + 2, yidx, temp);
}
Border.prototype.updateMesh = function () {
    var sx = this._left;
    var sy = this._top;// start x and start y
    var ex = this.mWidth - this._right;
    var ey = this.mHeight - this._bottom;// end x and end y
    var temp = [new _v3(), new _v2()];

    this.updateRow(sx, ex, 0, sy, 0, 0, temp);
    this.updateRow(sx, ex, sy, ey, 3, 0, temp);
    this.updateRow(sx, ex, ey, this.mHeight, 6, 0, temp);
}
Border.prototype.createMesh = function () {
    return _createMesh('p3t2', 54, _gl.TRIANGLES);
}
function addProp(pro, name) {
    var pname = '_' + name;
    pro[name] = function (d) {
        if (arguments.length == 0) {
            return this[pname];
        }
        this[pname] = d;
        return this;
    }
}
addProp(Border.prototype, 'left');
addProp(Border.prototype, 'top');
addProp(Border.prototype, 'right');
addProp(Border.prototype, 'bottom');

function Vertical() {
    if (arguments.length == 0) {
        this._top = this._bottom = 0;
    } else if (arguments.length == 1) {
        this._top = this._bottom = arguments[0];
    } else if (arguments.length == 2) {
        this._top = arguments[0];
        this._bottom = arguments[1];
    }
}
addProp(Vertical.prototype, 'top');
addProp(Vertical.prototype, 'bottom');

function Horizontal() {
    if (arguments.length == 0) {
        this._left = this._right = 0;
    } else if (arguments.length == 1) {
        this._left = this._right = arguments[0];
    } else if (arguments.length == 2) {
        this._left = arguments[0];
        this._right = arguments[1];
    }
}
addProp(Horizontal.prototype, 'left');
addProp(Horizontal.prototype, 'right');


module.exports = NinePatch;