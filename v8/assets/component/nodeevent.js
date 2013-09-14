var _inherit = require('core/inherit.js');
var _Element = require('component/element.js').prototype;

var TypeEventNode = 1;
var TypeTouchNode = 1 << 1;

function EventNode(node) {
    this.node = node;
    this.children = [];
    this.parent = null;
}
EventNode.prototype.type = TypeEventNode;
EventNode.prototype.addChild = function (child) {
    this.children.push(child);
    child.parent = this;
}
EventNode.prototype.removeChild = function (child) {
    var index = this.indexOf(child);
    if (index != -1) {
        this.children.slice(index, 1);
        child.parent = null;
    }
}
EventNode.prototype.indexOf = function (child) {
    for (var i = -1, arr = this.children, l = arr.length; ++i < l;) {
        if (arr[i] === child) {
            return i;
        }
    }
    return -1;
}
EventNode.prototype.isReachable = function () {
    return this.type == TypeTouchNode || this.children.length > 0;
}
EventNode.prototype.isTouchable = function () {
    return this.type == TypeTouchNode;
}
EventNode.prototype.onEvent = function (context) {
}

function TouchNode() {
    EventNode.call(this);
}
_inherit(TouchNode, EventNode);
TouchNode.prototype.type = TypeTouchNode;
TouchNode.prototype.onEvent = function () {
}

function onNodeAdd(parent, child) {
    var childTouch = child.__touchnode__;
    if (childTouch.type != TypeTouchNode) {
        return;
    }
    var parentTouch = parent.__touchnode__;
    parentTouch.addChild(childTouch);

    parent = parent.mParent;
    childTouch = parentTouch;
    while (parent) {
        parentTouch = parent.__touchnode__;
        // if parent contains child
        if (parentTouch.indexOf(childTouch) != -1) {
            break;
        }
        // if parent is already touchable or parent is root of event dispatch
        if (parentTouch.isReachable() || parent.isElementType(_Element.ElementTypeScene)) {
            parentTouch.addChild(childTouch);
            break;
        }
        // make sure parent has a reference of child, and check parent's parent
        parentTouch.addChild(childTouch);
        parent = parent.mParent;
        childTouch = parentTouch;
    }
}
function onNodeRemove(parent, child) {
    var childTouch = child.__touchnode__;
    var parentTouch = parent.__touchnode__;
    parentTouch.addChild(childTouch);

    parent = parent.mParent;
    childTouch = parentTouch;
    while (parent) {
        if (parent.isReachable()) {
            break;
        }
        parentTouch = parent.__touchnode__;
        parentTouch.removeChild(childTouch);
        parent = parent.mParent;
        childTouch = parentTouch;
    }
}
function onNodeMove(from, to, child) {
    if (from === to) {
        var childTouch = child.__touchnode__;
        var parentTouch = parent.__touchnode__;
        var index = parentTouch.indexOf(childTouch);
        if (index != -1) {
            parentTouch.removeChild(childTouch);
            parentTouch.addChild(childTouch);
        }
    } else {
        onNodeRemove(from, child);
        onNodeAdd(to, child);
    }
}

exports.EventNode = EventNode;
exports.TouchNode = TouchNode;
exports.onNodeAdd = onNodeAdd;
exports.onNodeRemove = onNodeRemove;
exports.onNodeMove = onNodeMove;