var program = require('glcore/program.js');
var gl = require('opengl');
var geometry = require('core/glm.js');
var glm = geometry.glm;
var textures = require('glcore/textures.js');

var _camera = require('render/camera.js');
var _Sprite = require('render/sprite.js');
var _Container = require('render/container.js');
var _frame = require('render/textureframe.js');
var _material = require('render/material.js');

var mProgram;
var mCamera;
var mContext;
var mContainer;

function setupGraphics(w, h) {
    mCamera = _camera.createCamera().lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]).ortho(-w / 2, w / 2, -h / 2, h / 2, 9, 11);

    mProgram = program.createWithFile('shader/position_texture.vert', 'shader/position_texture.frag');
    mProgram.addMeshAttrib('positionTexture', 'a_position', 'a_texCoord');

    mContainer = new _Container();

    var t1 = textures.createTexture2D('images/test.png');
    var sprite1 = new _Sprite(new _material(mProgram, t1), new _frame(t1));
    sprite1.setAnthor(0.5, 0.5);
    sprite1.setScale(0.5, -0.5);
    sprite1.setRotate(30);
    mContainer.addChild(sprite1);

    var t2 = textures.createTexture2D('images/word.png');
    var sprite2 = new _Sprite(new _material(mProgram, t2), new _frame(t2));
    sprite2.setAnthor(1, 1);
    sprite2.setScale(0.2, 0.2);
    mContainer.addChild(sprite2);

    mContext = {
        program: mProgram,
        pvmMatirx: mCamera.pmvMatirx(),
        matirx: new geometry.matrix4(),
        getMatrix: function (spriteM) {
            glm.mulMM(this.matirx, this.pvmMatirx, spriteM);
            return this.matirx;
        },
        render: function (node, mesh, material) {
            this.program.use();
            material.use();
            material.bindMatrix(this.getMatrix(node.mMatirx));
            material.bindMesh(mesh);
            mesh.draw();
        }
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.SCISSOR_TEST);
}
function renderFrame() {
    gl.clearColor(1, 1, 1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mContainer.draw(mContext);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
