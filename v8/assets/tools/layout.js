var _geometry = require('core/glm.js');

var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;

function getRelativePoint(node, rx, ry) {
    var fx = (rx - node.mCenterX) * node.mWidth;
    var fy = (ry - node.mCenterY) * node.mHeight;
    var m = node.getMatrix();
    var v = new _v3(x, y);
    _glm.mulMV3(v, m, v);
    return v;
}

exports.LayoutUtil = {
    relative: {
        layoutTo: function (fnode, fx, fy, tnode, tx, ty, offsetx, offsety) {
            var pf = getRelativePoint(fnode, fx, fy);
            var pt = getRelativePoint(tnode, tx, ty);
        }
    },
    absolute: {

    }
};