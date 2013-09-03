var _inherit = require('core/inherit.js');
var Mesh = require('render/mesh.js');
var _gl = require('opengl');
var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _v2 = _geometry.vec2f;
var _v3 = _geometry.vec3f;
var _order = [0, 0, 0, 1, 1, 0, 1, 1];

function Sprite(frame) {
    Mesh.call(this, 'p3t2', 4, _gl.TRIANGLE_STRIP);

    this.mFrame = frame;
    this.setSize(frame.width(), frame.height());
    this.mAccP = this.mBuffer.accessor('p');
    this.mAccT = this.mBuffer.accessor('t');

    this.initMesh();
}
_inherit(Sprite, Mesh);
Sprite.prototype.initMesh = function () {
    var f = this.mFrame;
    var m = f.getMatrix();
    var t = new _v2();
    var v = new _v3();
    var b = this.mBuffer;
    for (var i = 0; i < 8; i += 2) {
        f.getPoint(v, t, _order[i], _order[i + 1]);
        _glm.mulMV3(v, m, v);
        this.mAccT.set(t);
        this.mAccP.set(v);
        b.push(i / 2);
    }
    b.upload();
}
Sprite.prototype.draw = function (context) {
    this.updateMatrix();

    var program = context.program;
    program.use();
    program.setUniform('u_texture', this.mFrame.texture);
    program.setUniform('u_pvmMatrix', context.getMatrix(this.mMatirx));
    program.setAttrib('positionTexture', this.mBuffer);
    _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, 4);
}

module.exports = Sprite;