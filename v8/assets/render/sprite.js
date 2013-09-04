var _inherit = require('core/inherit.js');
var Node = require('render/node.js');
var createMesh = require('glcore/meshbuffer.js').createMesh;
var _gl = require('opengl');
var _geometry = require('core/glm.js');

var _glm = _geometry.glm;
var _v2 = _geometry.vec2f;
var _v3 = _geometry.vec3f;
var _order = [0, 0, 0, 1, 1, 0, 1, 1];

/**
 * @param frame texture frame
 * @constructor
 */
function Sprite(frame, material) {
    Node.call(this);

    this.mMaterial = material;
    this.mFrame = frame;
    this.mBuffer = createMesh('p3t2', 4, _gl.TRIANGLE_STRIP);
    this.mAccessorP = this.mBuffer.accessor('p');
    this.mAccessorT = this.mBuffer.accessor('t');
    this.setSize(frame.width(), frame.height());

    this.initMesh();
}
_inherit(Sprite, Node);
Sprite.prototype.initMesh = function () {
    var f = this.mFrame;
    var m = f.getMatrix();
    var t = new _v2();
    var v = new _v3();
    var b = this.mBuffer;

    for (var i = 0; i < 8; i += 2) {
        f.getPoint(v, t, _order[i], _order[i + 1]);
        _glm.mulMV3(v, m, v);

        this.mAccessorT.set(t);
        this.mAccessorP.set(v);
        b.push(i / 2);
    }

    b.upload();
}
Sprite.prototype.draw = function (context) {
    this.updateMatrix();
    context.render(this, this.mBuffer, this.mFrame, this.mMaterial);
}

module.exports = Sprite;