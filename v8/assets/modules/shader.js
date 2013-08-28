var gl = require('opengl');
var file = require('core/file.js');

var shaderDB = {};

function checkShader(shader) {
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw('Error compiling shader:' + log);
    }
}
function find(id) {
    return shaderDB[id]
}
function shader(id, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.checkGLError('shader=====01bb');
    gl.shaderSource(shader, shaderSource);
    gl.checkGLError('shader=====01aa');
    gl.compileShader(shader);
    gl.checkGLError('shader=====02');
    checkShader(shader);
    gl.checkGLError('shader=====03');

    this._id = id;
    this._glid = shader;
    this._release = false;
}
shader.prototype.getGLId = function () {
    return this._glid;
}
shader.prototype.release = function () {
    if (!this._release) {
        gl.deleteShader(this._glid);
        this._release = true;
    }
}

function create(id, shaderSource, shaderType) {
    var s = shaderDB[id];
    if (s) {
        return s;
    }
    try {
        s = new shader(id, shaderSource, shaderType);
        return shaderDB[id] = s;
    } catch (e) {
        console.log(e);
    }
    return null;
}
function createWithFile(id, path, shaderType) {
    var s = find(id);
    if (s) {
        return s;
    }

    var f = new file();
    f.loadAsset(path);
    var s = create(id, f.getContent(), shaderType);
    f.release();

    return s;
};
function releaseAll() {
    for (var i in shaderDB) {
        shaderDB[i].release();
    }
    shaderDB = {};
}
function releaseById(id) {
    var s = shaderDB[id];
    if (s) {
        s.release();
    }
    delete shaderDB[id];
}

exports.find = find;
exports.create = create;
exports.createWithFile = createWithFile;
exports.releaseAll = releaseAll;
exports.releaseById = releaseById;
