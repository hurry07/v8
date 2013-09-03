var clz = require('nativeclasses');

exports.vec2i = clz.vec2i;
exports.vec3i = clz.vec3i;
exports.vec4i = clz.vec4i;

exports.vec2s = clz.vec2s;
exports.vec3s = clz.vec3s;
exports.vec4s = clz.vec4s;

exports.vec2us = clz.vec2us;
exports.vec3us = clz.vec3us;
exports.vec4us = clz.vec4us;

exports.vec2f = clz.vec2f;
exports.vec3f = clz.vec3f;
exports.vec4f = clz.vec4f;

exports.mat2f = clz.mat2f;
exports.mat3f = clz.mat3f;
exports.mat4f = clz.mat4f;

exports.matrix2 = clz.matrix2;
exports.matrix3 = clz.matrix3;
exports.matrix4 = clz.matrix4;

exports.vector2 = clz.vector2;
exports.vector3 = clz.vector3;
exports.vector4 = clz.vector4;

exports.matrix = clz.matrix;
exports.vector = clz.vector;

function jlmJsImplement() {
    function Impl() {
    }

    Impl.prototype = {
        dotVec2: function (v1, v2) {
            return 0;
        },
        dotVec3: function (v1, v2) {
            return 0;
        },
        dotVec4: function (v1, v2) {
            return 0;
        },
        mulVec2: function (des, v1, v2) {
        },
        mulVec3: function (des, v1, v2) {
        },
        mulVec4: function (des, v1, v2) {
        },
        addVec2: function (des, v1, v2) {
        },
        addVec3: function (des, v1, v2) {
        },
        addVec4: function (des, v1, v2) {
        },
        subVec2: function (des, v1, v2) {
        },
        subVec3: function (des, v1, v2) {
        },
        subVec4: function (des, v1, v2) {
        },
        /**
         * @param {vector} des
         * @param {matrix} m
         * @param {vector} v
         */
        mulMV4: function (des, m, v) {
        },
        /**
         * @param {clz.vec3f} des
         * @param {matrix} m
         * @param {clz.vec3f} v
         */
        mulMV3: function (des, m, v) {
        },
        /**
         * @param {matrix} des
         * @param {matrix} m
         */
        inverse: function (des, m) {
        },
        /**
         * @param {matrix} des
         * @param {matrix} m1
         * @param {matrix} m2
         */
        mulMM: function (des, m1, m2) {
        },
        setTranslation: function () {
        },
        identity: function () {
        },
        perspective: function () {
        },
        /**
         * @param {matrix}
         * @param {number} left Left side of the near clipping plane viewport.
         * @param {number} right Right side of the near clipping plane viewport.
         * @param {number} bottom Bottom of the near clipping plane viewport.
         * @param {number} top Top of the near clipping plane viewport.
         * @param {number} near The depth (negative z coordinate) of the near clipping plane.
         * @param {number} far The depth (negative z coordinate) of the far clipping plane.
         */
        ortho: function (m, left, right, bottom, top, near, far) {
        },
        /**
         * @param {matrix}
         * @param {number} left Left side of the near clipping plane viewport.
         * @param {number} right Right side of the near clipping plane viewport.
         * @param {number} bottom Bottom of the near clipping plane viewport.
         * @param {number} top Top of the near clipping plane viewport.
         * @param {number} near The depth (negative z coordinate) of the near clipping plane.
         * @param {number} far The depth (negative z coordinate) of the far clipping plane.
         */
        frustum: function (m, left, right, bottom, top, near, far) {
        },
        /**
         * @param {matrix} m
         * @param {vector} eye
         * @param {vector} center
         * @param {vector} up
         */
        lookAt: function (m, eye, center, up) {
        },
        translate: function () {
        },
        rotateX: function () {
        },
        rotateY: function () {
        },
        rotateZ: function () {
        },
        rotate: function () {
        },
        scale: function () {
        },
        transpose: function () {
        },
        translation: function () {
        },
        scaling: function () {
        }
    };

    return Impl;
}
exports.glm = new clz.glm() || jlmJsImplement();
