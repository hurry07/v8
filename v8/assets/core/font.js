var clz = require('nativeclasses');

function jsImplement() {
    function Font(file) {
    }
    Font.prototype.release = function () {
    };
}

exports.font = clz.font || jsImplement();
exports.atlas = clz.atlas || jsImplement();
