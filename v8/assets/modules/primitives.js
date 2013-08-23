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
function AttribBuffer(numComponents, numElements, element) {
    this.buffer = new Float32Array(numComponents * numElements);
    this.elementTemp = new Float32Array(numComponents);
    this.cursor = 0;
    this.numComponents = numComponents;
    this.numElements = numElements;
    this.element = element;
};
AttribBuffer.prototype.stride = function () {
    return 0;
};
AttribBuffer.prototype.offset = function () {
    return 0;
};
AttribBuffer.prototype.getElement = function (index, element) {
    var offset = index * this.numComponents;
    if(element) {
        element
    }
    for (var ii = 0; ii < this.numComponents; ++ii) {
        value.push(this.buffer[offset + ii]);
    }
    return value;
};
AttribBuffer.prototype.setElement = function (index, value) {
    var offset = index * this.numComponents;
    for (var ii = 0; ii < this.numComponents; ++ii) {
        this.buffer[offset + ii] = value[ii];
    }
};

AttribBuffer.prototype.fillRange = function (index, count, value) {
    var offset = index * this.numComponents;
    for (var jj = 0; jj < count; ++jj) {
        for (var ii = 0; ii < this.numComponents; ++ii) {
            this.buffer[offset++] = value[ii];
        }
    }
};

AttribBuffer.prototype.clone = function () {
    var copy = new AttribBuffer(
        this.numComponents, this.numElements, this.type);
    copy.pushArray(this);
    return copy;
}

AttribBuffer.prototype.push = function (value) {
    this.setElement(this.cursor++, value);
};

/**
 * Creates sphere vertices.
 * The created sphere has position, normal and uv streams.
 *
 * @param {number} radius radius of the sphere.
 * @param {number} subdivisionsAxis number of steps around the sphere.
 * @param {number} subdivisionsHeight number of vertically on the sphere.
 * @param {number} opt_startLatitudeInRadians where to start the
 *     top of the sphere. Default = 0.
 * @param {number} opt_endLatitudeInRadians Where to end the
 *     bottom of the sphere. Default = Math.PI.
 * @param {number} opt_startLongitudeInRadians where to start
 *     wrapping the sphere. Default = 0.
 * @param {number} opt_endLongitudeInRadians where to end
 *     wrapping the sphere. Default = 2 * Math.PI.
 * @return {!Object.<string, !AttribBuffer>} The
 *         created plane vertices.
 */
function createSphere(radius, subdivisionsAxis, subdivisionsHeight, opt_startLatitudeInRadians, opt_endLatitudeInRadians, opt_startLongitudeInRadians, opt_endLongitudeInRadians) {
    if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
        throw Error('subdivisionAxis and subdivisionHeight must be > 0');
    }

    opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
    opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
    opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
    opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

    var latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
    var longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

    // We are going to generate our sphere by iterating through its
    // spherical coordinates and generating 2 triangles for each quad on a
    // ring of the sphere.
    var numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
    var positions = new AttribBuffer(3, numVertices);
    var normals = new AttribBuffer(3, numVertices);
    var texCoords = new AttribBuffer(2, numVertices);

    // Generate the individual vertices in our vertex buffer.
    for (var y = 0; y <= subdivisionsHeight; y++) {
        for (var x = 0; x <= subdivisionsAxis; x++) {
            // Generate a vertex based on its spherical coordinates
            var u = x / subdivisionsAxis;
            var v = y / subdivisionsHeight;
            var theta = longRange * u;
            var phi = latRange * v;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var ux = cosTheta * sinPhi;
            var uy = cosPhi;
            var uz = sinTheta * sinPhi;
            positions.push([radius * ux, radius * uy, radius * uz]);
            normals.push([ux, uy, uz]);
            texCoords.push([1 - u, v]);
        }
    }

    var numVertsAround = subdivisionsAxis + 1;
    var indices = new AttribBuffer(
        3, subdivisionsAxis * subdivisionsHeight * 2, 'Uint16Array');
    for (var x = 0; x < subdivisionsAxis; x++) {
        for (var y = 0; y < subdivisionsHeight; y++) {
            // Make triangle 1 of quad.
            indices.push([
                (y + 0) * numVertsAround + x,
                (y + 0) * numVertsAround + x + 1,
                (y + 1) * numVertsAround + x]);

            // Make triangle 2 of quad.
            indices.push([
                (y + 1) * numVertsAround + x,
                (y + 0) * numVertsAround + x + 1,
                (y + 1) * numVertsAround + x + 1]);
        }
    }

    return {
        position: positions,
        normal: normals,
        texCoord: texCoords,
        indices: indices};
};

exports.createSphere = createSphere;