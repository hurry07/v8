var createMesh = require('glcore/meshbuffer.js').createMesh;
var _gl = require('opengl');
var _geometry = require('core/glm.js');
var _MeshNode = require('render/meshnode.js');
var _inherit = require('core/inherit.js');

var _glm = _geometry.glm;
var _v2 = _geometry.vec2f;
var _v3 = _geometry.vec3f;
var _order = [0, 0, 0, 1, 1, 0, 1, 1];

/**
 * @param material
 * @param frame texture frame
 * @constructor
 */
function Sprite(material, frame) {
    _MeshNode.call(this, createMesh('p3t2', 4, _gl.TRIANGLE_STRIP), material);

    this.mFrame = frame;
    this.mAccessorP = this.mBuffer.accessor('p');
    this.mAccessorT = this.mBuffer.accessor('t');
    this.setSize(frame.width(), frame.height());

    this.initMesh();
}
_inherit(Sprite, _MeshNode);
Sprite.prototype.initMesh = function () {
    var f = this.mFrame;
    var m = f.getMatrix();
    var t = new _v2();
    var v = new _v3();
    var b = this.mBuffer;

    for (var i = 0; i < 8; i += 2) {
        f.getPoint(v, t, _order[i], _order[i + 1]);
        console.log(v, t);
        _glm.mulMV3(v, m, v);

        this.mAccessorT.set(t);
        this.mAccessorP.set(v);
        b.push(i / 2);
    }

    b.upload();
}

module.exports = Sprite;