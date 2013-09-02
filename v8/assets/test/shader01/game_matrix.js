var program = require('glcore/program.js');
var math3d = require('core/glm.js');
var gl = require('opengl');
var glBuffer = require('glcore/buffers.js');
var glm = math3d.glm;

var positionData = [
    -0.8, -0.8, 0.0,
    0.8, -0.8, 0.0,
    0.0,  0.8, 0.0 ];
var colorData = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0]);

var mProgram;
var positionBufferHandle;
var colorBufferHandle;
var vboIndexBuffer;

var rotationMatrix = new math3d.matrix();
var aix = new math3d.vector(0,0,1);
var angle = 0;

function setupGraphics(w, h) {
    mProgram = program.createWithFile('test/shader01/basic_uniform.vert', 'test/shader01/basic_uniform.frag');

    positionBufferHandle = glBuffer.createVectorBuffer(3, 3);
    positionBufferHandle.buffer().set(positionData);
    positionBufferHandle.upload();
    colorBufferHandle = glBuffer.createVectorBuffer(3, 3);
    colorBufferHandle.buffer().set(colorData);
    colorBufferHandle.upload();
    vboIndexBuffer = glBuffer.createIndexBuffer(3,2);
    vboIndexBuffer.buffer().set([0,1,2,0,1,2]);
    vboIndexBuffer.upload();

    mProgram.use();
    mProgram.setUniform('Blob', {r:0,g:0,b:0});
}
function renderFrame() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    rotationMatrix.identity();
    angle += 0.01;
    glm.rotate(rotationMatrix, angle, aix);

    mProgram.use();
    mProgram.setUniform('RotationMatrix', rotationMatrix);
    mProgram.setUniform('Blob.g', 1);
    mProgram.setAttrib('VertexPosition', positionBufferHandle);
    mProgram.setAttrib('VertexColor', colorBufferHandle);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
