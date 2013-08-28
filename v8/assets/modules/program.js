var gl = require('opengl');
var clz = require('nativeclasses');
var inherit = require('core/inherit.js');
var shader = require('modules/shader.js');

/**
 * handle for vector and matrix parameters
 *
 * @param loc param location
 * @param glfn glUniform function name
 */
function shaderParam(loc, glfn) {
    this.loc = loc;
    this.fn = glfn;
    this._data = 0;
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
 * a specific transpose param with uniformMatrix*fv
 *
 * @param loc
 * @param glfn
 * @param transpose
 */
function matrixParam(loc, glfn, transpose) {
    shaderParam.apply(this, arguments);
    this.transpose = transpose || false;
}
inherit(matrixParam, shaderParam);
matrixParam.prototype.upload = function(d) {
    if(d != undefined) {
        this.fn(this.loc, this.transpose, this._data = d);
    } else {
        this.fn(this.loc, this.transpose, this._data);
    }
}
/**
 * textureParam was created with a textureId with it
 *
 * @param loc
 * @param glfn
 * @param unit
 */
function textureParam(loc, glfn, unit) {
    shaderParam.apply(this, arguments);
    this.unit = unit;
}
inherit(textureParam, shaderParam);
textureParam.prototype.upload = function(d) {
    this.fn(this.loc, this.unit);
    if(d != undefined) {
        (this._data = d).bindToUnit(this.unit);
    } else {
        this._data.bindToUnit(this.unit);
    }
}

/**
 * class used for binding buffer as attribute of program
 * attribute is very large, and it may be changed frqnenctly, so there is no need to cash them
 * @param index
 */
function attribute(index) {
    this.index = index;
    this._data = 0;
}
attribute.prototype.upload = function (b) {
    b.bindVertex(this.index);
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
    var loc = gl.getUniformLocation(this._glid, info.name)
    var s;
    var size = info.size;
    var textureCount = 0;
    switch (info.type) {
        // -----------------
        case gl.FLOAT:
            if(size > 1) {
                s = new shaderParam(loc, gl.uniform1fv);
            } else {
                s = new shaderParam(loc, gl.uniform1f);
            }
            break;
        case gl.FLOAT_VEC2:
            s = new shaderParam(loc, gl.uniform2fv);
            break;
        case gl.FLOAT_VEC3:
            s = new shaderParam(loc, gl.uniform3fv);
            break;
        case gl.FLOAT_VEC4:
            s = new shaderParam(loc, gl.uniform4fv);
            break;
        // -----------------
        case gl.INT:
        case gl.BOOL:
            if(size > 1) {
                s = new shaderParam(loc, gl.uniform1iv);
            } else {
                s = new shaderParam(loc, gl.uniform1i);
            }
            break;
        case gl.INT_VEC2:
        case gl.BOOL_VEC2:
            s = new shaderParam(loc, gl.uniform2iv);
            break;
        case gl.INT_VEC3:
        case gl.BOOL_VEC3:
            s = new shaderParam(loc, gl.uniform3fv);
            break;
        case gl.INT_VEC4:
        case gl.BOOL_VEC4:
            s = new shaderParam(loc, gl.uniform4fv);
            break;
        // -----------------
        case gl.FLOAT_MAT2:
            s = new matrixParam(loc, gl.uniformMatrix2fv);
            break;
        case gl.FLOAT_MAT3:
            s = new matrixParam(loc, gl.uniformMatrix3fv);
            break;
        case gl.FLOAT_MAT4:
            s = new matrixParam(loc, gl.uniformMatrix4fv);
            break;
        // -----------------
        case gl.SAMPLER_2D:
        case gl.SAMPLER_CUBE:
            if(size > 1) {
                console.log('not supported TEXUTURE array');
            } else {
                s = new textureParam(loc, gl.uniform1i, textureCount++);
            }
            break;
        default:
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
    initAttribute(this._glid, this.attrib = {});
    initUniform(this._glid, this.uniforms = {}, this.textures = {});
}
program.prototype.getAttrib = function(name) {
    return this.attrib[name];
}
program.prototype.setAttrib = function(name, value) {
    var setter = this.attrib[name];
    if(setter) {
        setter.upload(value);
    }
}
program.prototype.getUniform = function(name) {
    return this.uniforms[name];
}
program.prototype.setUniform = function(name, value) {
    var setter = this.uniforms[name];
    if(setter) {
        setter.upload(value);
    }
}
program.prototype.use = function () {
    gl.useProgram(this._glid);
};

function getFileName(p) {
    var start = p.lastIndexOf('/') + 1;
    return p.slice(start, p.indexOf('.', start));
}
function getFileId(p) {
    var start = p.lastIndexOf('/') + 1;
    return p.slice(start);
}
function makeProgramId(p1, p2) {
    return getFileName(p1) + '_' + getFileName(p2);
}
/**
 *
 * @param vpath vector shader file path
 * @param fpath fragment shader file path
 * @returns {*}
 */
function createWithFile(vpath, fpath) {
    var id = makeProgramId(vpath, fpath);
    var s = find(id);
    if (s) {
        return s;
    }

    try {
        var vShader = shader.createWithFile(getFileId(vpath), vpath, gl.VERTEX_SHADER);
        var fShader = shader.createWithFile(getFileId(fpath), fpath, gl.FRAGMENT_SHADER);
        if (!vShader || !fShader) {
            return null;
        }
        return programDB[id] = new program(id, vShader, fShader);
    } catch (e) {
        console.log('program.createWithFile', e);
    }
    return null;
}

exports.find = find;
exports.createWithFile = createWithFile;
exports.releaseAll = releaseAll;
exports.releaseById = releaseById;
