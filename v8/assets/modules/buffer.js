var clz = require('nativeclasses');

/**
 * AttribBuffer manages a TypedArray as an array of vectors.
 *
 * @param {number} numComponents Number of components per
 *     vector.
 * @param {number|!Array.<number>} numElements Number of vectors or the data.
 * @param {string} opt_type The type of the TypedArray to
 *     create. Default = 'Float32Array'.
 * @param {!Array.<number>} opt_data The data for the array.
 */
function AttribBuffer(numComponents, numElements, element, buffer) {
    this._buffer = buffer || new Float32Array(numComponents * numElements);
    this.numComponents = numComponents;// size of each element
    this.numElements = numElements;
    this._element = element;

    this._cursor = 0;
};
AttribBuffer.prototype.stride = function () {
    return 0;
};
AttribBuffer.prototype.offset = function () {
    return 0;
};
AttribBuffer.prototype.getElement = function (index, element) {
    this._buffer.get(element || (element = new this._element()), index * this.numComponents);
    return element;
};
AttribBuffer.prototype.setElement = function (index, value) {
    this._buffer.set(value, index * this.numComponents);
};
AttribBuffer.prototype.fillRange = function (index, count, value) {
    var offset = index * this.numComponents;
    for (var jj = 0; jj < count; ++jj) {
        for (var ii = 0; ii < this.numComponents; ++ii) {
            this._buffer[offset++] = value[ii];
        }
    }
};
AttribBuffer.prototype.clone = function () {
    return new AttribBuffer(this.numComponents, this.numElements, this._element, new Float32Array(this._buffer.buffer.slice(0)));
}
AttribBuffer.prototype.push = function (value) {
    this.setElement(this._cursor++, value);
};
AttribBuffer.prototype.cursor = function() {
    if(arguments.length == 0) {
        return this._cursor;
    }
    this._cursor = arguments[0];
}

module.exports = AttribBuffer;
