var program = require('glcore/program.js');
var gl = require('opengl');
var geometry = require('core/glm.js');
var glm = geometry.glm;
var textures = require('glcore/textures.js');

var _camera = require('render/camera.js');
var _sprite = require('render/sprite.js');
var _frame = require('render/textureframe.js');
var _material = require('render/material.js');

var mProgram;
var mTexture;
var mCamera;
var mSprite;
var mContext;

function setupGraphics(w, h) {
    mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(-w / 2, w / 2, -h / 2, h / 2, 9, 11);

    mProgram = program.createWithFile('shader/position_texture.vert', 'shader/position_texture.frag');
    mProgram.addMeshAttrib('positionTexture', 'a_position', 'a_texCoord');

    mTexture = textures.createTexture2D('images/word.png');
    mSprite = new _sprite(new _frame(mTexture), new _material(mProgram));
    mSprite.setAnthor(0.5, 0.5);
    mSprite.setScale(0.5, -0.6);
    mSprite.setRotate(30);

    mProgram.use();
//    mProgram.setUniform('u_texture', mTexture);
//    mProgram.setUniform('u_pvmMatrix', mCamera.pmvMatirx());
    mContext = {
        program: mProgram,
        pvmMatirx: mCamera.pmvMatirx(),
        matirx: new geometry.matrix4(),
        getMatrix: function (spriteM) {
            glm.mulMM(this.matirx, this.pvmMatirx, spriteM);
            return this.matirx;
        },
        render: function (node, mesh, textureframe, material) {
            this.program.use();
            this.program.setUniform('u_pvmMatrix', this.getMatrix(node.mMatirx));
            material.bindTexture(textureframe);
            material.bindMesh(mesh);
            mesh.draw();
        }
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
function renderFrame() {
    gl.clearColor(1, 1, 1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mProgram.use();
    mSprite.draw(mContext);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
