var program = require('glcore/program.js');
var gl = require('opengl');
var geometry = require('core/glm.js');
var glm = geometry.glm;
var textures = require('glcore/textures.js');
var mesh = require('render/mesh.js');
var _camera = require('render/camera.js');

var mProgram;
var mTexture;
var mMesh;
var mCamera;

function setupGraphics(w, h) {
    mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(-w / 2, w / 2, -h / 2, h / 2, 9, 11);

    mProgram = program.createWithFile('shader/position_texture.vert', 'shader/position_texture.frag');
    mProgram.addMeshAttrib('positionTexture', 'a_position', 'a_texCoord');

    var unit = w * 0.15;
    mMesh = mesh.createMesh('p2t2', 4);
    mMesh.cursor(0).set([-unit, unit], [0, 0]);
    mMesh.cursor(1).set([-unit, -unit], [0, 1]);
    mMesh.cursor(2).set([unit, unit], [1, 0]);
    mMesh.cursor(3).set([unit, -unit], [1, 1]);
    mMesh.upload();

    mTexture = textures.createTexture2D('images/word.png');

    mProgram.use();
    mProgram.setUniform('u_texture', mTexture);
    mProgram.setUniform('u_pvmMatrix', mCamera.pmvMatirx());

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
function renderFrame() {
    gl.clearColor(1, 1, 1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mProgram.use();
    mProgram.setAttrib('positionTexture', mMesh);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
