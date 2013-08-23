var gl = require('opengl');
var shader = require('modules/shader.js');
var clz = require('nativeclasses');

/**
 * handle for vector and matrix parameters
 *
 * @param loc
 * @param glfn
 * @param data
 */
function shaderParam(loc, glfn, data) {
    this.loc = loc;
    this.fn = glfn;
    this._data = data;
}
shaderParam.prototype.data = function() {
    if(arguments.length > 0) {
        this._data = arguments[0];
    } else {
        return this._data;
    }
}
shaderParam.prototype.upload = function(d) {
    if(d != undefined) {
        this.fn(this.loc, this._data = d);
    } else {
        this.fn(this.loc, this._data);
    }
}

/**
 * class used for binding buffer as attribute of program
 * attribute is very large, and it may be changed frqnenctly, so there is no need to cash them
 * @param index
 */
function attribute(index) {
    this.index = index;
}
attribute.prototype.upload = function (b) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer());
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(this.index, b.numComponents(), b.type(), b.normalize(), b.stride(), b.offset());
}

var programDB = {};

function find(id) {
    return programDB[id]
}
function releaseAll() {
    for (var i in programDB) {
        programDB[i].release();
    }
    programDB = {};
}
function releaseById(id) {
    var s = programDB[id];
    if (s) {
        s.release();
    }
    delete programDB[id];
}


function createUniformSetter(info) {
    var loc = gl.getUniformLocation(program, info.name)
    var s;
    switch (info.type) {
        // -----------------
        case gl.FLOAT:
            s = new shaderParam(loc, gl.uniform1fv, new Float32Array([0]));
            break;
        case gl.FLOAT_VEC2:
            s = new shaderParam(loc, gl.uniform2fv, new clz.vec2f());
            break;
        case gl.FLOAT_VEC3:
            s = new shaderParam(loc, gl.uniform3fv, new clz.vec3f());
            break;
        case gl.FLOAT_VEC4:
            s = new shaderParam(loc, gl.uniform4fv, new clz.vec4f());
            break;
        // -----------------
        case gl.INT:
            s = new shaderParam(loc, gl.uniform1fv, new Int32Array([0]));
            break;
        case gl.INT_VEC2:
            s = new shaderParam(loc, gl.uniform2fv, new clz.vec2i());
            break;
        case gl.INT_VEC3:
            s = new shaderParam(loc, gl.uniform3fv, new clz.vec3i());
            break;
        case gl.INT_VEC4:
            s = new shaderParam(loc, gl.uniform4fv, new clz.vec4i());
            break;
        // -----------------
        case gl.BOOL:
            s = new shaderParam(loc, gl.uniform1iv, new Int32Array([0]));
            break;
        case gl.BOOL_VEC2:
            s = new shaderParam(loc, gl.uniform2iv, new clz.vec2i());
            break;
        case gl.BOOL_VEC3:
            s = new shaderParam(loc, gl.uniform3iv, new clz.vec3i());
            break;
        case gl.BOOL_VEC4:
            s = new shaderParam(loc, gl.uniform4iv, new clz.vec4i());
            break;
        // -----------------
        case gl.FLOAT_MAT2:
            s = new shaderParam(loc, gl.uniformMatrix2fv, new clz.mat2f());
            break;
        case gl.FLOAT_MAT3:
            s = new shaderParam(loc, gl.uniformMatrix3fv, new clz.mat3f());
            break;
        case gl.FLOAT_MAT4:
            s = new shaderParam(loc, gl.uniformMatrix4fv, new clz.mat4f());
            break;
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            s = new shaderParam(loc, gl.uniform1fv, new Int32Array([0]));
            break;
        default:
            console.log('uniform param type not match');
            break;
    }
    return s;
}
function initUniform(program, uniforms, textures) {
    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var ii = 0; ii < numUniforms; ++ii) {
        var info = gl.getActiveUniform(program, ii);
        if (!info) {
            break;
        }
        var name = info.name;
        console.log('uniform:', name);
        var setter = createUniformSetter(info);
        uniforms[name] = setter;
        if (info.type == gl.SAMPLER_2D || info.type == gl.SAMPLER_CUBE) {
            textures[name] = setter;
        }
    }
}
function initAttribute(program, attribs) {
    var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var ii = 0; ii < numAttribs; ++ii) {
        var info = gl.getActiveAttrib(program, ii);
        if (!info) {
            break;
        }
        if (info.size != 1) {
            throw("arrays of attribs not handled");
        }

        var index = gl.getAttribLocation(program, info.name);
        attribs[info.name] = new attribute(index);
    }
    return attribs;
}

/**
 * check if there is any link error
 * @param program
 */
function checkProgram(program) {
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var log = gl.getProgramInfoLog(program);
        throw('Error in program linking:' + log);
    }
}
/**
 *
 * @param id
 * @param vShader shader object
 * @param fShader shader object
 */
function program(id, vShader, fShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vShader.getGLId());
    gl.attachShader(program, fShader.getGLId());
    gl.linkProgram(program);
    checkProgram(program);

    this._id = id;
    this._glid = program;
    this._release = false;

    this.createSetters();
}
program.prototype.getGLId = function () {
    return this._id;
}
program.prototype.release = function () {
    if (!this._release) {
        gl.deleteProgram(this._glid);
        this._release = true;
    }
}
program.prototype.createSetters = function () {
    initAttribute(this._glid, this.attribs = {});
    initUniform(this._glid, this.uniforms = {}, this.textures = {});
}
program.prototype.getUniform = function(name) {
    return this.uniforms[name];
}
program.prototype.setUniform = function(name, value) {
    var setter = this.uniforms[name];
    if(setter) {
        setter.data.init(value);
        setter.update();
    }
}

function getFileName(p) {
    var start = p.lastIndexOf('/') + 1;
    return p.slice(start, p.indexOf('.', start));
}
function makeProgramId(p1, p2) {
    return getFileName(p1) + '_' + getFileName(p2);
}
function createWithFile(vpath, fpath) {
    var id = makeProgramId(vpath, fpath);
    var s = find(id);
    if (s) {
        return s;
    }

    try {
        var vShader = shader.createWithFile(getFileName(vpath), vpath, gl.VERTEX_SHADER);
        var fShader = shader.createWithFile(getFileName(fpath), fpath, gl.FRAGMENT_SHADER);
        if (!vShader || !fShader) {
            return null;
        }
        return programDB[id] = new program(id, vShader, fShader);
    } catch (e) {
        console.log(e);
    }
    return null;
}

exports.find = find;
exports.createWithFile = createWithFile;
exports.releaseAll = releaseAll;
exports.releaseById = releaseById;
