var gl = require('opengl');
var file = require('lib/io.js');

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

function setupGraphics(w, h) {
//    glm::vec4 position = glm::vec4( 1.0f, 0.0f, 0.0f, 1.0f );
//    glm::mat4 view = glm::lookAt(glm::vec3(0.0,0.0,5.0),
//                                 glm::vec3(0.0,0.0,0.0),
//                                 glm::vec3(0.0,1.0,0.0));
//    glm::mat4 model = glm::mat4(1.0f);
//    model = glm::rotate( model, 90.0f, glm::vec3(0.0f,1.0f,0.0) );
//    glm::mat4 mv = view * model;
//    glm::vec4 transformed = mv * position;
//
//	LOGI("setupGraphics(%d, %d)", w, h);
//
//	printGLString("Version", GL_VERSION);
//	printGLString("Vendor", GL_VENDOR);
//	printGLString("Renderer", GL_RENDERER);
//	printGLString("Extensions", GL_EXTENSIONS);

    gProgram = createProgram('shader/gljs_v.vtx', 'shader/gljs_f.frg');
    console.log('create.gProgram', gProgram);
    if (!gProgram) {
        console.log("Could not create program.");
        return false;
    }
//    var numAttribs = gl.getProgramParameter(gProgram, gl.ACTIVE_ATTRIBUTES);
//    console.log('numAttribs', numAttribs);
//    for (var ii = 0; ii < numAttribs; ++ii) {
//        var info = gl.getActiveAttrib(gProgram, ii);
//        console.log('info===:', info.name, info.type, info.size);
//    }
    gvPositionHandle = gl.getAttribLocation(gProgram, "vPosition");
    console.log("glGetAttribLocation vPosition=", gvPositionHandle);

    console.log('setupGraphics', w, h);
    gl.viewport(0, 0, w, h);

    console.log("done.");
    return true;
}

var grey = 0;
var gTriangleVertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

function renderFrame() {
    grey += 0.001;
    if (grey > 1.0) {
        grey = 0.0;
    }
    var alpha = 2 * grey;
    if (alpha > 1) {
        alpha = 2 - alpha;
    }
    gl.clearColor(alpha, alpha, alpha, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.useProgram(gProgram);
    gl.vertexAttribPointer(gvPositionHandle, 2, gl.FLOAT, false, 0, gTriangleVertices);
    gl.enableVertexAttribArray(gvPositionHandle);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

exports.renderFrame = renderFrame;
exports.setupGraphics = setupGraphics;
