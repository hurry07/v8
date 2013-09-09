var _material = require('render/material.js');
var _inherit = require('core/inherit.js');

// create user defined material
exports.positionTexture = _inherit(function (program, frame) {
    _material.call(this, program);
    this.frame = frame;
    this.texture = frame.texture;
}, _material, {
    use: function () {
        this.program.use();
        this.program.setUniform('u_texture', this.texture);
    },
    bindMesh: function (mesh) {
        var p = this.program;
        mesh.bindBuffer();
        p.setAttrib('a_position', mesh.accessor('p'));
        p.setAttrib('a_texCoord', mesh.accessor('t'));
    },
    bindMatrix: function (matrix) {
        this.program.setUniform('u_pvmMatrix', matrix);
    },
    create: function (program, frame) {
        return new this.constructor(program, frame);
    }
});

exports.positionColor = _inherit(function (program, color) {
    _material.call(this, program);
    this.color = new Float32Array(color);
}, _material, {
    use: function () {
        this.program.use();
        this.program.setUniform('u_color', this.color);
    },
    bindMesh: function (mesh) {
        var p = this.program;
        mesh.bindBuffer();
        p.setAttrib('a_position', mesh.accessor('p'));
    },
    bindMatrix: function (matrix) {
        this.program.setUniform('u_pvmMatrix', matrix);
    },
    create: function (program, color) {
        return new this.constructor(program, color);
    }
});