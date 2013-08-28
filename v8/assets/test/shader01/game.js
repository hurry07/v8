var program = require('modules/program.js');
var math3d = require('core/math3d.js');
var gl = require('opengl');
var glBuffer = require('modules/typedbuffer.js');

var positionData = new Float32Array([
    -0.8, -0.8, 0.0,
    0.8, -0.8, 0.0,
    0.0, 0.8, 0.0 ]);
var colorData = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0]);

var mProgram;
var vboPositionBufferHandle;
var vboColorBufferHandle;

function setupGraphics(w, h) {
    mProgram = program.createWithFile('test/shader01/basic.vert', 'test/shader01/basic.frag');

    vboPositionBufferHandle = glBuffer.createVectorBuffer(3, 3);
    vboPositionBufferHandle.buffer().set(positionData);
    vboPositionBufferHandle.upload();
    vboColorBufferHandle = glBuffer.createVectorBuffer(3, 3);
    vboColorBufferHandle.buffer().set(colorData);
    vboColorBufferHandle.upload();
}
function renderFrame() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mProgram.use();
    mProgram.setAttrib('VertexPosition', vboPositionBufferHandle);
    mProgram.setAttrib('VertexColor', vboColorBufferHandle);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
