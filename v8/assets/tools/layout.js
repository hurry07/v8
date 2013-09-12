var _geometry = require('core/glm.js');

var _glm = _geometry.glm;
var _v3 = _geometry.vec3f;

function getRelativePointToLocal(node, v) {
    v = new _v3(v);
    v.mul(node.mSize);
    v.sub(node.mCenter);
    return v;
}

function getPointToLocal(node, v) {
    v = new _v3(v);
    v.sub(node.mCenter);
    return v;
}
function localToWorld(node, v) {
    var m = node.getMatrix();
    _glm.mulMV3(v, m, v);
    return v;
}

function getPointRelative(node, v) {
    v = getRelativePointToLocal(node, v);
    return localToWorld(node, v);
}
function getPoint(node, v) {
    v = getPointToLocal(node, v);
    return localToWorld(node, v);
}
/**
 * get a point in object coordinate system
 * @param node
 * @param v
 * @returns {_v3}
 */
function getLocalPoint(node, v) {
    var m = node.getMatrix();
    return localToWorld(node, new _v3(v));
}

function getLayoutTo(trans) {
    function layoutTo(fnode, v1, tnode, v2, voffset) {
        var fromVec = trans(fnode, v1);
        var toVec = trans(tnode, v2);
        toVec.sub(fromVec);
        if (voffset) {
            toVec.add(voffset);// append offset
        }

        fnode.translate(toVec);
    }

    // function (fnode, v1, tnode, v2)
    // function (fnode, v1, tnode, v2, v3)
    // function (fnode, x1, y1, tnode, x2, y2)
    // function (fnode, x1, y1, tnode, x2, y2, ox, oy)
    return function () {
        var a = arguments;
        switch (arguments.length) {
            case 4:
            case 5:
                layoutTo.apply(this, arguments);
                break;
            case 6:
                layoutTo(a[0], new _v3(a[1], a[2]), a[3], new _v3(a[4], a[5]));
                break;
            case 8:
                layoutTo(a[0], new _v3(a[1], a[2]), a[3], new _v3(a[4], a[5]), new _v3(a[6], a[7]));
                break;
            default :
                console.log('LayoutUtil.getLayout arguments number not supported, please check');
                break;
        }
    }
}
function getLayout(trans) {
    // function (fnode, p1, p2)
    // function (fnode, x1, y1, x2, y2)
    function layout(fnode, pFrom, pTo) {
        var fromVec = trans(fnode, pFrom);
        fromVec.sub(pTo);
        fromVec.scale(-1);
        fnode.translate(fromVec);
    }

    // function (fnode, p1, p2)
    // function (fnode, x1, y1, x2, y2)
    return function () {
        var a = arguments;
        switch (arguments.length) {
            case 3:
                layout(a[0], a[1], a[2]);
            case 5:
                layout(a[0], new _v3(a[1], a[2]), new _v3(a[3], a[4]));
                break;
            default :
                console.log('LayoutUtil.getLayout arguments number not supported, please check');
                break;
        }
    }
}
function pointToLocal(trans) {
    // function (fnode, p)
    // function (fnode, x, y)
    return function () {
        var a = arguments;
        switch (arguments.length) {
            case 2:
                return getPointToLocal(a[0], a[1]);
            case 3:
                return getPointToLocal(a[0], new _v3(a[1], a[2]));
            default :
                console.log('LayoutUtil.localPoint arguments number not supported, please check');
                break;
        }
    }
}

// layout using world coordinate
exports.relative = {
    layoutTo: getLayoutTo(getPointRelative),
    layout: getLayout(getPointRelative),
    localPoint: pointToLocal(getRelativePointToLocal)
};
exports.absolute = {
    layoutTo: getLayoutTo(getPoint),
    layout: getLayout(getPoint),
    localPoint: pointToLocal(getPointToLocal)
}
// layout using object coordinate
exports.local = {
    layoutTo: getLayoutTo(getLocalPoint),
    layout: getLayout(getLocalPoint)
}
