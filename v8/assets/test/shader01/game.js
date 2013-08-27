var program = require('modules/program.js');
var math3d = require('core/math3d.js');
var gl = require('opengl');

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
    console.log('mProgram', mProgram);
    vboPositionBufferHandle = gl.createBuffer();
    vboColorBufferHandle = gl.createBuffer();
    console.log(vboPositionBufferHandle, vboColorBufferHandle);

    gl.bindBuffer(gl.ARRAY_BUFFER, vboPositionBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColorBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
}
function renderFrame() {
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
