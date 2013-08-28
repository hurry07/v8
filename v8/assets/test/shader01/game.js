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
    console.log('mProgram', mProgram);
    vboPositionBufferHandle = gl.createBuffer();
    vboColorBufferHandle = gl.createBuffer();
    console.log(vboPositionBufferHandle, vboColorBufferHandle);

    mProgram.setUniform('VertexColor', positionData);

    // create vbo and load data
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPositionBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColorBufferHandle);
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

    var stride = 3;
    var buffer = glBuffer.createBuffer({
        stride : stride,
        count : 10,
        type : Float32Array,
        element : math3d['vector' + stride],
        normalize : false
    });
    var v_ = new math3d.vector3();
    var v0 = buffer.getElement(0);
    console.log(v0);

    v_.set([1,2,3]);
    buffer.setElement(1, v_);
    console.log(buffer.getElement(1));
}
function renderFrame() {
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
