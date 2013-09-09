var _gl = require('opengl');
var _geometry = require('core/glm.js');
var _MeshNode = require('render/meshnode.js');
var _createMesh = require('glcore/meshbuffer.js').createMesh;
var _inherit = require('core/inherit.js');

var _matrix4 = _geometry.matrix4;
var _v2 = _geometry.vec2f;
var _v3 = _geometry.vec3f;
var _glm = _geometry.glm;

/**
 * underlying detail operation
 *
 * @param buf
 * @param frame
 * @constructor
 */
function Filler(buf, frame) {
    this.index = 0;
    this.buf = buf;
    this.frame = frame;
    this.v = new _v3();
    this.t = new _v2();
    this.accp = buf.accessor('p');
    this.acct = buf.accessor('t');
}
Filler.prototype.copyPoint = function (from, to) {
    this.buf.copy(from, to, 1);
}
Filler.prototype.fillPoint = function (m, x, y, start) {
    this.index = start;
    var v = this.v;
    this.frame.getPointAbs(v, this.t, x, y);
    _glm.mulMV3(v, m, v);

    this.acct.set(this.t);
    this.accp.set(this.v);
    this.buf.push(this.index);
}


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
    this.updateMesh();
}
_inherit(NinePatch, _MeshNode);
NinePatch.prototype.createMesh = function () {
}
NinePatch.prototype.updateMesh = function () {
}
NinePatch.prototype.init = function () {
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
Border.prototype.fillRect = function (acc, m, x1, y1, x2, y2, start) {
    acc.fillPoint(m, x1, y1, start);
    acc.fillPoint(m, x1, y2, start + 1);
    acc.fillPoint(m, x2, y1, start + 2);
    acc.copyPoint(start + 2, start + 3);
    acc.copyPoint(start + 1, start + 4);
    acc.fillPoint(m, x2, y2, start + 5);
}
Border.prototype.updateMesh = function () {
    var fw = this.mFrame.width();
    var fh = this.mFrame.height();
    var m = new _matrix4();
    var acc = new Filler(this.mBuffer, this.mFrame);

    this.mFrame.getMatrix(m);
    this.fillRect(acc, m, 0, fh - this._bottom, this._left, fh, 36);
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

/**
 * create a general nine patch
 *
 * @param material
 * @param frame
 */
function create9Patch(material, frame) {
    var nine = new Border(material, frame);
    if (arguments.length > 2) {
        nine.init.apply(nine, Array.prototype.slice.call(arguments, 2));
        nine.updateMesh();
    }
    return nine;
}

module.exports.create9Patch = create9Patch;