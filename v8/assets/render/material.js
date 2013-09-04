/**
 * used as a program's attrbute setter
 * @constructor
 */
function Material(program) {
    this.program = program;
}
Material.prototype.bindMesh = function (mesh) {
    var p = this.program;
    mesh.bindBuffer();
    p.setAttrib('a_position', mesh.accessor('p'));
    p.setAttrib('a_texCoord', mesh.accessor('t'));
}
Material.prototype.bindTexture = function (frame) {
    this.program.setUniform('u_texture', frame.texture);
}

module.exports = Material;