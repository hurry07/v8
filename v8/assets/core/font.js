var clz = require('nativeclasses');

function atlasImplement() {
    function Atlas(file) {
    }
    Atlas.prototype.release = function () {
    };
    return Atlas;
}
function fontImplement() {
    function Font(file) {
    }
    Font.prototype.release = function () {
    };
    Font.prototype.outline_type = function () {
    };
    Font.prototype.outline_thickness = function () {
    };
    /**
     * @param {string} text
     * @param {Float32Array} widths
     */
    Font.prototype.measure = function (text, widths) {
    };
    Font.prototype.height = 0;
    Font.prototype.ascender = 0;
    Font.prototype.descender = 0;

    return Font;
}

exports.font = clz.font || fontImplement();
exports.atlas = clz.atlas || atlasImplement();
