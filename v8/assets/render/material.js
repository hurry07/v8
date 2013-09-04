/**
 * used as a program's attrbute setter
 * @constructor
 */
function Material(program, texture) {
    this.program = program;
    this.texture = texture;
}
Material.prototype.use = function () {
    this.program.use();
    this.program.setUniform('u_texture', this.texture);
}
Material.prototype.bindMesh = function (mesh) {
    var p = this.program;
    mesh.bindBuffer();
    p.setAttrib('a_position', mesh.accessor('p'));
    p.setAttrib('a_texCoord', mesh.accessor('t'));
}
Material.prototype.bindMatrix = function (matrix) {
    this.program.setUniform('u_pvmMatrix', matrix);
}

module.exports = Material;