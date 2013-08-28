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
var gl = require('opengl');

/**
 * @param array 数据
 *     {
 *         Array
 *         numComponents
 *         numElements
 *     }
 * @param opt_target 绑定的目标对象
 * @constructor
 */
function Buffer(array, opt_target) {
    var target = opt_target || gl.ARRAY_BUFFER;
    var buf = gl.createBuffer();// 立刻就建立一个插槽对象
    this.target = target;// 数据分配的位置
    this.buf = buf;// 分配的 buf id
    this.set(array);

    this.numComponents_ = array.numComponents;
    this.numElements_ = array.numElements;

    this.totalComponents_ = this.numComponents_ * this.numElements_;
    if (array.buffer instanceof Float32Array) {
        this.type_ = gl.FLOAT;// 数据类型
        this.normalize_ = false;
    } else if (array.buffer instanceof Uint8Array) {
        this.type_ = gl.UNSIGNED_BYTE;
        this.normalize_ = true;
    } else if (array.buffer instanceof Int8Array) {
        this.type_ = gl.BYTE;
        this.normalize_ = true;
    } else if (array.buffer instanceof Uint16Array) {
        this.type_ = gl.UNSIGNED_SHORT;
        this.normalize_ = true;
    } else if (array.buffer instanceof Int16Array) {
        this.type_ = gl.SHORT;
        this.normalize_ = true;
    } else {
        throw("unhandled type:" + (typeof array.buffer));
    }
};

/**
 * 绑定数据
 * @param array
 * @param opt_usage
 */
Buffer.prototype.set = function (array, opt_usage) {
    gl.bindBuffer(this.target, this.buf);
    gl.bufferData(this.target, array.buffer, opt_usage || gl.STATIC_DRAW);
}
Buffer.prototype.setRange = function (array, offset) {
    gl.bindBuffer(this.target, this.buf);
    gl.bufferSubData(this.target, offset, array);// 更新数据的一部分
}
Buffer.prototype.type = function () {
    return this.type_;// 内部数据类型
};
Buffer.prototype.numComponents = function () {
    return this.numComponents_;
};
Buffer.prototype.numElements = function () {
    return this.numElements_;
};
Buffer.prototype.totalComponents = function () {
    return this.totalComponents_;
};
Buffer.prototype.buffer = function () {
    return this.buf;
};
Buffer.prototype.stride = function () {
    return 0;
};
Buffer.prototype.normalize = function () {
    return this.normalize_;
}
Buffer.prototype.offset = function () {
    return 0;
};

module.exports = Buffer;


