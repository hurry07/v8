var program = require('glcore/program.js');
var math3d = require('core/glm.js');
var gl = require('opengl');
var glBuffer = require('glcore/buffers.js');
var glm = math3d.glm;
var Texture2D = require('glcore/textures.js').Texture2D;
var Mesh = require('render/meshbuffer.js');

var positionData = new Float32Array([
    -0.8, -0.8, 0.0,
    0.8, -0.8, 0.0,
    0.8,  0.8, 0.0,
    -0.8, -0.8, 0.0,
    0.8, 0.8, 0.0,
    -0.8, 0.8, 0.0
]);
var tcData = new Float32Array([
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
]);

var mProgram;
var positionBufferHandle;
var colorBufferHandle;
var Tex1;

function setupGraphics(w, h) {
    mProgram = program.createWithFile('test/shader01/basic_uniformblock.vert', 'test/shader01/basic_uniformblock.frag');

    positionBufferHandle = glBuffer.createVectorBuffer(3, 6);
    positionBufferHandle.buffer().set(positionData);
    positionBufferHandle.upload();
    colorBufferHandle = glBuffer.createVectorBuffer(2, 6);
    colorBufferHandle.buffer().set(tcData);
    colorBufferHandle.upload();

    Tex1 = new Texture2D('images/word.png');
//    Tex1 = new Texture2D('images/test.png');
//    Tex1 = new Texture2D('images/pngnow.png');

    mProgram.use();
//    mProgram.setUniform('Blob', {
//        InnerColor : new math3d.vector4(1.0, 1.0, 0.75, 1.0),
//        OuterColor : new math3d.vector4(),
//        RadiusInner : 0.1,
//        RadiusOuter : 0.9
//    });
    mProgram.setUniform('Tex1', Tex1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
function renderFrame() {
    gl.clearColor(1, 1, 1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mProgram.use();
    mProgram.setAttrib('VertexPosition', positionBufferHandle);
    mProgram.setAttrib('VertexTexCoord', colorBufferHandle);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
