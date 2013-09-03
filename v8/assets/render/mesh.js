var _inherit = require('core/inherit.js');
var _Node = require('render/node.js');
var _buffer = require('render/meshbuffer.js');
var gl = require('opengl');

function Mesh(fields, count, mode) {
    _Node.call(this);

    this.mFields = fields;
    this.mPoints = count;
    this.mMode = mode || gl.TRIANGLES;
    this.createBuffer();
}
_inherit(Mesh, _Node);
/**
 * you should implemente this
 * @param count
 */
Mesh.prototype.createBuffer = function () {
    this.mBuffer = _buffer.createMesh(this.mFields, this.mPoints);
}
Mesh.prototype.draw = function (context) {
    context.bindMesh(this);
    gl.drawArrays(this.mMode, 0, this.mPoints);
}
