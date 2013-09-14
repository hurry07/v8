var _Container = require('component/container.js');
var _inherit = require('core/inherit.js');
var __removeChild = _Container.__removeChild;
var _EventNodes = require('component/nodeevent.js');
var _EventNode = _EventNodes.EventNode;

var UIContainer = _inherit(function () {
    _Container.call(this);
    this.mEventNode = this.createEventNode();
}, _Container);
UIContainer.prototype.createEventNode = function () {
    return new _EventNode(this);
}
UIContainer.prototype.nodeListener = null;
UIContainer.prototype.__isUiNode = true;
UIContainer.prototype.__elementType |= UIContainer.prototype.ElementTypeUIContainer;
UIContainer.prototype.addChild = function (child) {
    if (!child) {
        return;
    }
    var olderp = child.parent;
    var listener = this.nodeListener;
    if (olderp && __removeChild(olderp.children, child) && listener) {
        this.children.push(child);
        child.mParent = this;
        if (child.__isUiNode && listener) {
            listener.onNodeMove(olderp, this, child);
        }
        return;
    }

    this.children.push(child);
    child.mParent = this;
    if (child.__isUiNode && listener) {
        listener.onNodeAdd(this, child);
    }
}
UIContainer.prototype.removeChild = function (child) {
    if (!child) {
        return;
    }
    var listener = this.nodeListener;
    var removed = __removeChild(this.children, child);
    if (child.__isUiNode && removed && listener) {
        listener.onNodeRemove(this, child);
    }
    return child;
}
/**
 * set node listener for all ui node
 */
UIContainer.setNodeListener = function () {
    UIContainer.prototype.nodeListener = listener;
}

module.exports = UIContainer;
