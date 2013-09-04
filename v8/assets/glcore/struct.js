var getGLType = require('glcore/utils.js').getGLType;
var getByteSize = require('glcore/utils.js').getByteSize;
var inherit = require('core/inherit.js');

/**
 * use as super class of anonymous class of instance
 */
function structSuper() {
    var mBuffer = new ArrayBuffer(this.byteLength);
    var arrayAccess = this.arrayAccess;

    var mFieldMap = {};
    for (var i = 0, l = arrayAccess.length; i < l; i++) {
        var p = arrayAccess[i];
        var acc = new p.type(mBuffer, p.byteOffset, p.size);
        acc.__order__ = i;// bind customer property to TypedBuffer object

        mFieldMap[i] = acc;
        mFieldMap[p.name || i] = acc;
    }

    this.mBuffer = mBuffer;
    this.mFieldMap = mFieldMap;
}
structSuper.prototype.field = function (name) {
    return this.mFieldMap[name];
}
structSuper.prototype.fields = function () {
    return this.mFieldMap;
}
structSuper.prototype.buffer = function () {
    return this.mBuffer;
}

/**
 * unit of a mix buffer
 *
 * @param byteLength
 * @param parts
 */
function structInst(byteLength, arrayAccess) {
    this.byteLength = byteLength;
    this.arrayAccess = arrayAccess;
    structSuper.call(this);
}
inherit(structInst, structSuper);

/**
 * helper class of creating a mix buffer structor
 */
function structBuilder() {
    this.parts = [];
}
/**
 *
 * @param name
 * @param type the container type
 * @param size
 * @returns {*}
 */
structBuilder.prototype.add = function (name, type, size) {
    if (arguments.length == 2) {
        this.parts.push({type: name, size: type});
    } else {
        this.parts.push({name: name, type: type, size: size});
    }
    return this;
}
/**
 * calculate the elemenet's strides
 *
 * @param bufAccess
 * @param arrayAccess
 * @returns {number}
 */
structBuilder.prototype.initBufMap = function () {
    var byteLength = 0;
    for (var i = 0, ps = this.parts, length = ps.length; i < length; i++) {
        var p = ps[i];
        p.byteOffset = byteLength;
        p.byteLength = getByteSize(p.type) * p.size;
        p.glType = getGLType(p.type);

        byteLength += p.byteLength;
    }
    return byteLength;
}
/**
 * create an instance of current class, you must hold this refer for futher use.
 * @returns {structInst}
 */
structBuilder.prototype.create = function () {
    var byteLength = this.initBufMap();
    var arrayAccess = this.parts;
    return new structInst(byteLength, arrayAccess);
}
/**
 * return a class of this mix buffer
 * @returns {*}
 */
structBuilder.prototype.createClass = function () {
    var byteLength = this.initBufMap();
    var arrayAccess = this.parts;
    var clz = inherit(
        function () {
            structSuper.call(this);
        }, structSuper, {
            byteLength: byteLength,
            arrayAccess: arrayAccess
        }
    );
    return clz;
}
structBuilder.prototype.createBuffer = function (count) {
    return this.createClass().createBuffer.apply(this, arguments);
}

function createStruct() {
    return new structBuilder();
}

exports.createStruct = createStruct;// used as basic of mesh buffer