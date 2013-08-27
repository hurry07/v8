var gl = require('opengl');
var file = require('core/file.js');
var math3d = require('core/math3d.js');
var glm = math3d.glm;

function checkShader(shader) {
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw('Error compiling shader:' + log);
    }
}
function checkProgram(program) {
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var log = gl.getProgramInfoLog(program);
        throw('Error in program linking:' + log);
    }
}

function loadShader(shaderType, path) {
    var f = new file();
    f.loadAsset(path);
    var pSource = f.getContent();
    f.release();

    var shader = gl.createShader(shaderType);
    if (shader) {
        gl.shaderSource(shader, pSource);
        gl.compileShader(shader);
        checkShader(shader);
    }
    return shader;
}
function createProgram(pVertexSource, pFragmentSource) {
    var vertexShader = loadShader(gl.VERTEX_SHADER, pVertexSource);
    console.log('vertexShader', vertexShader);
    if (!vertexShader) {
        return 0;
    }
    var pixelShader = loadShader(gl.FRAGMENT_SHADER, pFragmentSource);
    console.log('pixelShader', pixelShader);
    if (!pixelShader) {
        return 0;
    }

    var program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, pixelShader);
        gl.linkProgram(program);
        checkProgram(program);
    }
    return program;
}

var gProgram;
var gvPositionHandle;
var projectView;

function setupGraphics(w, h) {
    gProgram = createProgram('shader/gljs_v.vtx', 'shader/gljs_f.frg');
    console.log('create.gProgram', gProgram);
    if (!gProgram) {
        console.log("Could not create program.");
        return false;
    }
    gvPositionHandle = gl.getAttribLocation(gProgram, 'vPosition');
    projectView = gl.getUniformLocation(gProgram, 'projectView');
    console.log('gvPositionHandle', gvPositionHandle);
    console.log('projectView', projectView);

//    console.log("glGetAttribLocation vPosition=", gvPositionHandle);
//    console.log('setupGraphics', w, h);
    gl.viewport(0, 0, w, h);

    console.log("done.");
    return true;
}

var grey = 0;
var gTriangleVertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

var lookAtMatrix = new math3d.matrix();
glm.lookAt(lookAtMatrix, new math3d.vector(0,0,100), new math3d.vector(0,0,0), new math3d.vector(0,1,0));
console.log('lookAtMatrix', lookAtMatrix);

var project = new math3d.matrix();
//glm.frustum(project, -1, 1, -1, 1, 50, 101);
glm.ortho(project, -1, 1, -1, 1, 1, 101);
console.log(project);

var paramMatrix = new math3d.matrix();
glm.mulMM(paramMatrix, project, lookAtMatrix);
//var paramMatrix = new math3d.matrix();
//glm.mulMM(paramMatrix, project, lookAtMatrix);

function printXY(x, y) {
    var v = new math3d.vector(x, y, 0);
    var vdes = new math3d.vector();
    glm.mulMV3(vdes, paramMatrix, v);
    console.log(vdes);
}
printXY(0, 0.5);
printXY(-0.5, -0.5);
printXY(0.5, -0.5);

//
//var p2 = new math3d.matrix();
//glm.scale(p2, new math3d.vector(0.1, 0.1, 0.1));
//console.log(p2);
//
//var mul1 = new math3d.matrix();
//glm.mulMM(mul1, project, p2);
//console.log(mul1);

//var resArr = mulMatrixMatrix4(project, p2);
////resArr[15] = 100;
//console.log(new math3d.matrix(resArr));

function renderFrame() {
    var alpha = 1;
//    grey += 0.001;
//    if (grey > 1.0) {
//        grey = 0.0;
//    }
//    var alpha = 2 * grey;
//    if (alpha > 1) {
//        alpha = 2 - alpha;
//    }
    gl.clearColor(alpha, alpha, alpha, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.useProgram(gProgram);
    gl.uniformMatrix4fv(projectView, false, paramMatrix);

    gl.vertexAttribPointer(gvPositionHandle, 2, gl.FLOAT, false, 0, gTriangleVertices);
    gl.enableVertexAttribArray(gvPositionHandle);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
