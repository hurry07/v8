var _Node = require('component/node.js');
var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _matrix = _geometry.matrix4;
var _inherit = require('core/inherit.js');

function __removeChild(children, child) {
    for (var i = 0, l = children.length; i < l; i++) {
        if (children[i] === child) {
            children.splice(i, 1);
            child.mParent = null;
            return true;
        }
    }
    return false;
}

function NodeListener() {
}
NodeListener.prototype.onNodeAdd = function (parent, child) {
}
NodeListener.prototype.onNodeRemove = function (parent, child) {
}
NodeListener.prototype.onNodeMove = function (from, to, child) {
}

function Container() {
    _Node.call(this);
    this.children = [];
}
_inherit(Container, _Node);
Container.prototype.nodeListener = null;
Container.prototype.addChild = function (child) {
    var olderp = child.parent;
    var listener = this.nodeListener;
    if (olderp && __removeChild(olderp.children, child) && listener) {
        this.children.push(child);
        child.mParent = this;
        listener.onNodeMove(olderp, this, child);
        return;
    }

    this.children.push(child);
    child.mParent = this;
    if (listener) {
        listener.onNodeAdd(this, child);
    }
}
Container.prototype.removeChild = function (child) {
    var removed = __removeChild(this.children, child);
    var listener = this.nodeListener;
    if (removed && listener) {
        listener.onNodeRemove(this, child);
    }
    return child;
}
Container.prototype.draw = function (context) {
    if (!this.mVisiable) {
        return;
    }
    this.updateMatrix();
    context.pushMatrix(this.mMatrix);
    this.drawContent(context);
    context.popMatrix();
}
Container.prototype.drawContent = function (context) {
    for (var i = 0, cs = this.children, l = cs.length; i < l; i++) {
        if (cs[i]) {
            cs[i].draw(context);
        }
    }
}

var scilentContainer = _inherit(function () {
    Container.call(this);
}, Container, {
    addChild: function (child) {
        var olderp = child.parent;
        olderp && __removeChild(olderp.children, child);
        this.children.push(child);
        child.mParent = this;
    },
    removeChild: function (child) {
        __removeChild(this.children, child);
        return child;
    }
});

module.exports = Container;
module.exports.scilentContainer = scilentContainer;