var program = require('modules/program.js');
var math3d = require('core/math3d.js');
var gl = require('opengl');
var glBuffer = require('modules/typedbuffer.js');
var glm = math3d.glm;

var positionData = [
    -0.8, -0.8, 0.0,
    0.8, -0.8, 0.0,
    0.0, 0.8, 0.0 ];
var colorData = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0]);

var mProgram;
var positionBufferHandle;
var colorBufferHandle;
var vboIndexBuffer;

var rotationMatrix = new math3d.matrix();
var aix = new math3d.vector(0, 0, 1);
var angle = 0;
var BlobSettings = {
    InnerColor: new math3d.vector4(1.0, 1.0, 0.75, 1.0),
    OuterColor: new math3d.vector4(),
    RadiusInner: 0.25,
    RadiusOuter: 0.45
}

function printArr(l) {
    var len = l.length;
    var s = '';
    for (var i = 0; i < len; i++) {
        s += ' ,' + l[i];
    }
    console.log(len, s);
}
function setupGraphics(w, h) {
    mProgram = program.createWithFile('test/shader01/basic_uniformblock.vert', 'test/shader01/basic_uniformblock.frag');

    positionBufferHandle = glBuffer.createVectorBuffer(3, 3);
    positionBufferHandle.buffer().set(positionData);
    positionBufferHandle.upload();
    colorBufferHandle = glBuffer.createVectorBuffer(3, 3);
    colorBufferHandle.buffer().set(colorData);
    colorBufferHandle.upload();
    vboIndexBuffer = glBuffer.createIndexBuffer(3, 2);
    vboIndexBuffer.buffer().set([0, 1, 2, 0, 1, 2]);
    vboIndexBuffer.upload();

    var mixBuf = glBuffer.structure()
        .add('InnerColor', Float32Array, 4)
        .add('OuterColor', Float32Array, 4)
        .add('RadiusInner', Float32Array, 1)
        .add('RadiusOuter', Float32Array, 1)
        .createBuffer();
    var element = mixBuf.getElement(0);
    console.log('element:' + element);
    var buffer = element.buffer();
    var fbuffer = new Float32Array(buffer);
    printArr(fbuffer);

    element.set('InnerColor', [15, 20]);
    printArr(fbuffer);
    element.set('OuterColor', [18, 90], 1);
    printArr(fbuffer);
    element.set('RadiusOuter', [1]);
    printArr(fbuffer);

//    mProgram.use();
//    mProgram.setUniform('Blob', {r:0,g:0,b:0});
//    mProgram.setUniform('BlobSettings', BlobSettings);
}
function renderFrame() {
//    gl.clearColor(0, 0, 0, 0);
//    gl.clear(gl.COLOR_BUFFER_BIT);
//
//    rotationMatrix.identity();
//    angle += 0.01;
//    glm.rotate(rotationMatrix, angle, aix);
//
//    mProgram.use();
//    mProgram.setUniform('RotationMatrix', rotationMatrix);
//    mProgram.setUniform('Blob.g', 1);
//    mProgram.setAttrib('VertexPosition', positionBufferHandle);
//    mProgram.setAttrib('VertexColor', colorBufferHandle);
//
//    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
