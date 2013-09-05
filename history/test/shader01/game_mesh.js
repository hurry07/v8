var program = require('glcore/program.js');
var math3d = require('core/glm.js');
var gl = require('opengl');
var glBuffer = require('glcore/glbuffer.js');
var glm = math3d.glm;
var Texture2D = require('glcore/textures.js').Texture2D;
var Mesh = require('render/meshbuffer.js');

var mProgram;
var Tex1;
var mMesh;

function setupGraphics(w, h) {
    mProgram = program.createWithFile('test/shader01/basic_uniformblock.vert', 'test/shader01/basic_uniformblock.frag');

    mMesh = Mesh.createMesh('p2t2', 6);
    mMesh.cursor(0).set([-0.8,-0.8], [0,1]);
    mMesh.cursor(1).set([0.8,-0.8], [1,1]);
    mMesh.cursor(2).set([0.8,0.8], [1,0]);
    mMesh.copy(0, 3);
    mMesh.copy(2, 4);
    mMesh.cursor(5).set([-0.8,0.8], [0,0]);
    mMesh.upload();

    Tex1 = new Texture2D('images/word.png');
//    Tex1 = new Texture2D('images/test.png');
//    Tex1 = new Texture2D('images/pngnow.png');

    mProgram.use();
    mProgram.setUniform('Tex1', Tex1);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
function renderFrame() {
    gl.clearColor(1, 1, 1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mProgram.use();
    mProgram.setAttrib('p2t2', mMesh);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
