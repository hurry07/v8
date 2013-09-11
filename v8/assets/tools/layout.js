var _geometry = require('core/glm.js');

var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;
var _matrix = _geometry.matrix4;

function getPointRelative(node, rx, ry) {
    var fx = (rx - node.mCenterX) * node.mWidth;
    var fy = (ry - node.mCenterY) * node.mHeight;
    var m = node.getMatrix();
    var v = new _v3(fx, fy);
    _glm.mulMV3(v, m, v);
    return v;
}
function getPoint(node, x, y) {
    var m = node.getMatrix();
    var v = new _v3(x, y);
    _glm.mulMV3(v, m, v);
    return v;
}

exports.LayoutUtil = {
    relative: {
        layoutTo: function (fnode, fx, fy, tnode, tx, ty, offsetx, offsety) {
            offsetx = offsetx || 0;
            offsety = offsety || 0;

            var fromVec = getPointRelative(fnode, fx, fy);
            var toVec = getPointRelative(tnode, tx, ty);
            toVec.sub(fromVec);
            fromVec.set(offsetx, offsety, 0);
            toVec.add(fromVec);

            fnode.getPosition().add(toVec);
        },
        layout: function (fnode, fx, fy, x, y) {
            var fromVec = getRelativePoint(fnode, fx, fy);
            var toVec = new _v3(x, y, 0);
            toVec.sub(fromVec);
            fnode.getPosition().add(toVec);
        }
    },
    absolute: {
        layoutTo: function (fnode, fx, fy, tnode, tx, ty, offsetx, offsety) {
            offsetx = offsetx || 0;
            offsety = offsety || 0;

            var fromVec = getRelativePoint(fnode, fx, fy);
            var toVec = getRelativePoint(tnode, tx, ty);
            toVec.sub(fromVec);
            fromVec.set(offsetx, offsety, 0);
            toVec.add(fromVec);

            fnode.getPosition().add(toVec);
        },
        layout: function (fnode, fx, fy, x, y) {
            var fromVec = getRelativePoint(fnode, fx, fy);
            var toVec = new _v3(x, y, 0);
            toVec.sub(fromVec);
            fnode.getPosition().add(toVec);
        }
    }
};