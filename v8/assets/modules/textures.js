/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @fileoverview This file contains objects to manage textures.
 */
var gl = require('opengl');
var inherit = require('core/inherit.js');
var Image = require('core/image.js');

var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
var maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
var db = {};
var loadingImages = [];

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
};
function powOf2(num) {
    num--;
    var offset = 1;
    while ((num & (num + 1)) != 0) {
        num |= num >> offset;
        offset = offset << 1;
    }
    return num + 1;
}
function handleContextLost_() {
    delete db;
    var imgs = loadingImages;
    for (var ii = 0; ii < imgs.length; ++ii) {
        imgs[ii].onload = undefined;
    }
    loadingImages = [];
};

/**
 * @param target parameter target
 * @constructor
 */
function Texture(target) {
    this.target = target;
    this.texture = gl.createTexture();
    this.params = {};
};
Texture.prototype.setParameter = function(pname, value) {
    this.params[pname] = value;
    gl.bindTexture(this.target, this.texture);
    gl.texParameteri(this.target, pname, value);
};
/**
 * bind texture again
 */
Texture.prototype.recoverFromLostContext = function() {
    this.texture = gl.createTexture();
    gl.bindTexture(this.target, this.texture);
    for (var pname in this.params) {
        gl.texParameteri(this.target, pname, this.params[pname]);
    }
    this.uploadTexture();
}
Texture.prototype.bindToUnit = function (unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
};
Texture.prototype.uploadTexture = function() {
    // waiting for implementation
};


/**
 * A solid color texture.
 *
 * @constructor
 * @param {!tdl.math.vector4} color.
 */
function SolidTexture(color) {
    Texture.call(this, gl.TEXTURE_2D);
    this.color = new Uint8Array(color);
    this.uploadTexture();
}
inherit(SolidTexture, Texture);
/**
 * bind the texture to opengl
 */
SolidTexture.prototype.uploadTexture = function () {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    var pixel = new Uint8Array(this.color);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
}

/**
 * A depth texture.
 * @constructor
 * @param {number} width
 * @param {number} height
 */
DepthTexture = function (width, height) {
    Texture.call(this, gl.TEXTURE_2D);
    this.width = width;
    this.height = height;
    this.uploadTexture();
};
inherit(DepthTexture, Texture);
DepthTexture.prototype.uploadTexture = function () {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.DEPTH_COMPONENT,
        this.width,
        this.height,
        0,
        gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT,
        null);
    this.setParameter(gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    this.setParameter(gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    this.setParameter(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    this.setParameter(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
};

/**
 * A color from an array of values texture.
 * TODO should supply a data class later
 *
 * @constructor
 * @param {!{width: number, height: number: pixels:
 *        !Array.<number>} data.
 */
function ColorTexture(data, opt_format, opt_type) {
    Texture.call(this, gl.TEXTURE_2D);
    this.format = opt_format || gl.RGBA;
    this.type = opt_type || gl.UNSIGNED_BYTE;
    if (data.pixels instanceof Array) {
        data.pixels = new Uint8Array(data.pixels);
    }
    this.data = data;
    this.uploadTexture();
};
inherit(ColorTexture, Texture);
ColorTexture.prototype.uploadTexture = function () {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        this.format,
        this.data.width,
        this.data.height,
        0,
        this.format,
        this.type,
        this.data.pixels);
};

/**
 * @constructor
 * @param {{string|!Element}} url URL of image to load into texture.
 * @param {function} opt_callback Function to execute when texture is loaded.
 */
function Texture2D(url, opt_flipY) {
    Texture.call(this, gl.TEXTURE_2D);
    this.flipY = opt_flipY || false;
    this.url = url;
    this.wrapWidth = this.wrapHeight = 1;
    this.width = this.height = 1;

    this.setParameter(gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    this.setParameter(gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    this.setParameter(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    this.setParameter(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.uploadTexture();
};
inherit(Texture2D, Texture);
Texture2D.prototype.uploadTexture = function () {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    var pixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    var img = new Image(this.url);
    this.width = img.width;
    this.height = img.height;
    this.wrapWidth = powOf2(this.width);
    this.wrapHeight = powOf2(this.height);

    if(this.width != this.wrapWidth || this.height != this.wrapHeight) {
        gl.texImage2D(gl.TEXTURE_2D, 0, img.internalFormat, this.wrapWidth, this.wrapHeight, 0, img.format, img.type, 0);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, img.format, img.type, img);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, img.internalFormat, img.format, img.type, img);
    }
};

/**
 * Create and load a CubeMap.
 * @constructor
 * @param {!Array.<string>} urls The urls of the 6 faces, which
 *     must be in the order positive_x, negative_x positive_y,
 *     negative_y, positive_z, negative_z OR an array with a single url
 *     where the images are arranged as a cross in this order.
 *
 *     +--+--+--+--+
 *     |  |PY|  |  |
 *     +--+--+--+--+
 *     |NX|PZ|PX|NZ|
 *     +--+--+--+--+
 *     |  |NY|  |  |
 *     +--+--+--+--+
 */
function CubeMap(urls) {
    Texture.call(this, gl.TEXTURE_CUBE_MAP);
    // TODO(gman): make this global.
    if (!CubeMap.faceTargets) {
        CubeMap.faceTargets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
        CubeMap.offsets = [
            [2, 1],
            [0, 1],
            [1, 0],
            [1, 2],
            [1, 1],
            [3, 1]
        ];
    }
    var faceTargets = CubeMap.faceTargets;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    this.setParameter(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    this.setParameter(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    this.setParameter(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.faces = [];
    if (!urls.length) {
        this.numUrls = 0;
        this.size = urls;
    } else {
        this.numUrls = urls.length;
        var that = this;
        for (var ff = 0; ff < urls.length; ++ff) {
            var face = { };
            this.faces[ff] = face;
            var img = document.createElement('img');
            addLoadingImage_(img);
            face.img = img;
            img.onload = function (faceIndex) {
                return function () {
                    removeLoadingImage_(img);
                    console.log("loaded image: ", urls[faceIndex]);
                    that.updateTexture(faceIndex);
                }
            }(ff);
            img.onerror = function (url) {
                return function () {
                    console.log("could not load image: ", url);
                }
            }(urls[ff]);
            img.src = urls[ff];
        }
    }
    this.uploadTextures();
};
inherit(CubeMap, Texture);
/**
 * Check if all faces are loaded.
 * @return {boolean} true if all faces are loaded.
 */
CubeMap.prototype.loaded = function () {
    for (var ff = 0; ff < this.faces.length; ++ff) {
        if (!this.faces[ff].loaded) {
            return false;
        }
    }
    return true;
};
clampToMaxSize = function (element, maxSize) {
    if (element.width <= maxSize && element.height <= maxSize) {
        return element;
    }
    var maxDimension = Math.max(element.width, element.height);
    var newWidth = Math.floor(element.width * maxSize / maxDimension);
    var newHeight = Math.floor(element.height * maxSize / maxDimension);

    var canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(
        element,
        0, 0, element.width, element.height,
        0, 0, newWidth, newHeight);
    return canvas;
};
/**
 * Uploads the images to the texture.
 */
CubeMap.prototype.uploadTextures = function () {
    var allFacesLoaded = this.loaded();
    var faceTargets = CubeMap.faceTargets;
    for (var faceIndex = 0; faceIndex < 6; ++faceIndex) {
        var uploaded = false;
        var target = faceTargets[faceIndex];
        if (this.faces.length) {
            var face = this.faces[Math.min(this.faces.length - 1, faceIndex)];
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
            if (allFacesLoaded) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
                if (this.faces.length == 6) {
                    gl.texImage2D(
                        target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                        clampToMaxSize(
                            face.img, gl.maxCubeMapSize));
                } else {
                    var canvas = document.createElement('canvas');
                    var width = face.img.width / 4;
                    var height = face.img.height / 3;
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    var sx = CubeMap.offsets[faceIndex][0] * width;
                    var sy = CubeMap.offsets[faceIndex][1] * height;
                    ctx.drawImage(face.img, sx, sy, width, height, 0, 0, width, height);
                    gl.texImage2D(
                        target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                        clampToMaxSize(
                            canvas, gl.maxCubeMapSize));
                }
                uploaded = true;
            }
        }
        if (!uploaded) {
            var pixel = new Uint8Array([100, 100, 255, 255]);
            gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        }
    }
    var genMips = false;
    if (this.faces.length) {
        var faceImg = this.faces[0].img;
        if (this.faces.length == 6) {
            genMips = isPowerOf2(faceImg.width) &&
                isPowerOf2(faceImg.height);
        } else {
            genMips = isPowerOf2(faceImg.width / 4) &&
                isPowerOf2(faceImg.height / 3);
        }
    }
    if (genMips) {
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        this.setParameter(gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
        this.setParameter(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
};

/**
 * Recover from lost context.
 */
CubeMap.prototype.recoverFromLostContext = function () {
    Texture.recoverFromLostContext.call(this);
    this.uploadTextures();
};
/**
 * Update a just downloaded loaded texture.
 * @param {number} faceIndex index of face.
 */
CubeMap.prototype.updateTexture = function (faceIndex) {
    // mark the face as loaded
    var face = this.faces[faceIndex];
    face.loaded = true;
    // If all 6 faces are loaded then upload to GPU.
    var loaded = this.loaded();
    if (loaded) {
        this.uploadTextures();
    }
};
/**
 * Binds the CubeMap to a texture unit
 * @param {number} unit The texture unit.
 */
CubeMap.prototype.bindToUnit = function (unit) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
};

exports.SolidTexture = SolidTexture;
exports.Texture2D = Texture2D;

