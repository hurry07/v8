var meshBuffer = require('glcore/meshbuffer.js');
var gl = require('opengl');

/**
 * drawable data structor
 *
 * @param struct field byte order in one mesh point
 * @param count point count
 * @param mode point mode, drawElements is deprecated
 * @constructor
 */
function Mesh(struct, count, mode) {
    this.mStruct = struct;
    this.mPoints = count;
    this.mMode = mode || gl.TRIANGLES;

    this.mBuffer = meshBuffer.createMesh(this.mStruct, this.mPoints);
}
Mesh.prototype.draw = function (context) {
    context.bindMesh(this);
    gl.drawArrays(this.mMode, 0, this.mPoints);
}
Mesh.prototype.buffer = function () {
    return this.mBuffer;
}

module.exports = Mesh;