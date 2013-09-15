var _Container = require('component/container.js');
var _inherit = require('core/inherit.js');
var __removeChild = _Container.__removeChild;
var _EventNode = require('component/nodeevent.js').EventNode;
var _listener = require('component/nodeevent.js');

var UIContainer = _inherit(function () {
    _Container.call(this);
    this.__touchnode__ = this.createEventNode();
}, _Container);
UIContainer.prototype.createEventNode = function () {
    return new _EventNode(this);
}
UIContainer.prototype.__isUiNode = true;
UIContainer.prototype.__elementType |= UIContainer.prototype.ElementTypeUIContainer;
UIContainer.prototype.addChild = function (child) {
    if (!child) {
        return;
    }
    var olderp = child.parent;
    if (olderp && __removeChild(olderp.children, child)) {
        this.children.push(child);
        child.mParent = this;
        if (child.isUIElement()) {
            _listener.onNodeMove(olderp, this, child);
        }
        return;
    }

    this.children.push(child);
    child.mParent = this;
    if (child.isUIElement()) {
        _listener.onNodeAdd(this, child);
    }
}
UIContainer.prototype.removeChild = function (child) {
    if (!child) {
        return;
    }
    var removed = __removeChild(this.children, child);
    if (child.__isUiNode && removed) {
        _listener.onNodeRemove(this, child);
    }
    return child;
}
UIContainer.prototype.toString = function () {
    return this.mTag;
}
module.exports = UIContainer;
