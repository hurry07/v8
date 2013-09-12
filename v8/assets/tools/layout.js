var _geometry = require('core/glm.js');

var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;

function getPointRelative(node, rx, ry) {
    var v = new _v3(rx, ry);
    v.mul(node.mSize);
    v.sub(node.mCenter);

    var m = node.getMatrix();
    _glm.mulMV3(v, m, v);
    return v;
}
/**
 * given a point in customer view, that is outer of the object
 *
 * @param node
 * @param x
 * @param y
 * @returns {_v3} return the customer point in world coordinate
 */
function getPoint(node, x, y) {
    var v = new _v3(x, y);
    v.sub(node.mCenter);

    var m = node.getMatrix();
    _glm.mulMV3(v, m, v);
    return v;
}
/**
 * get a point in object coordinate system
 * @param node
 * @param x
 * @param y
 * @returns {_v3}
 */
function getLocalPoint(node, x, y) {
    var v = new _v3(x, y);
    var m = node.getMatrix();
    _glm.mulMV3(v, m, v);
    return v;
}

function getLayoutTo(trans) {
    return function (fnode, fx, fy, tnode, tx, ty, offsetx, offsety) {
        offsetx = offsetx || 0;
        offsety = offsety || 0;

        var fromVec = trans(fnode, fx, fy);
        var toVec = trans(tnode, tx, ty);
        toVec.sub(fromVec);
        fromVec.set(offsetx, offsety, 0);
        toVec.add(fromVec);// append offset

        fnode.translate(toVec);
    }
}
function getLayout(trans) {
    return function (fnode, fx, fy, x, y) {
        var fromVec = trans(fnode, fx, fy);
        var toVec = new _v3(x, y, 0);
        toVec.sub(fromVec);

        fnode.translate(toVec);
    }
}

// layout using world coordinate
exports.relative = {
    layoutTo: getLayoutTo(getPointRelative),
    layout: getLayout(getPointRelative)
};
exports.absolute = {
    layoutTo: getLayoutTo(getPoint),
    layout: getLayout(getPoint)
}
// layout using object coordinate
exports.local = {
    layoutTo: getLayoutTo(getLocalPoint),
    layout: getLayout(getLocalPoint)
}
