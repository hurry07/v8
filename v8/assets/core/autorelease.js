var clz = require('nativeclasses');

function jsImplement() {
    function AutoRelease(type) {
    }

    AutoRelease.prototype.release = function () {
    };
    AutoRelease.prototype.values = function () {
    };
}

var TaskGLBuffer = 0;
var TaskGLTexture = 1;
var autorelease = clz.autorelease || jsImplement();

function getReleaseFn(type) {
    return function () {
        var auto = new autorelease(type);
        auto.values.apply(auto, arguments);
        return auto;
    }
}

exports.releaseGLBuffer = getReleaseFn(TaskGLBuffer);
exports.releaseGLTexture = getReleaseFn(TaskGLTexture);
