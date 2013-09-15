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
        this.children.splice(index, 1);
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
EventNode.prototype.print = function (prefix) {
    prefix = prefix || '';
    if (this.children.length == 0) {
        console.log(prefix + this.node);
        return;
    }

    var header = prefix + '    ';
    console.log(prefix + this.node + ': {');
    for (var i = -1, arr = this.children, l = arr.length; ++i < l;) {
        arr[i].print(header);
    }
    console.log(prefix + '}');
}

function TouchNode(node) {
    EventNode.call(this, node);
}
_inherit(TouchNode, EventNode);
TouchNode.prototype.type = TypeTouchNode;
TouchNode.prototype.onEvent = function () {
}

function onNodeAdd(parent, child) {
    var childTouch = child.__touchnode__;
    if (!childTouch.isReachable()) {
        return;
    }

    var parentTouch = parent.__touchnode__;
    parentTouch.addChild(childTouch);

    parent = parent.mParent;
    childTouch = parentTouch;
    while (parent) {
        // if parent contains child
        parentTouch = parent.__touchnode__;
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
        childTouch = parentTouch;
        parent = parent.mParent;
    }
}
function onNodeRemove(parent, child) {
    console.log('onNodeRemove', parent, child);
    var parentTouch = parent.__touchnode__;
    var childTouch = child.__touchnode__;
    console.log('removeChild 01', parentTouch.children.length);
    parentTouch.removeChild(childTouch);
    console.log('removeChild 02', parentTouch.children.length);

    parent = parent.mParent;
    childTouch = parentTouch;
    while (parent) {
        if (childTouch.isReachable()) {
            break;
        }

        parentTouch = parent.__touchnode__;
        parentTouch.removeChild(childTouch);
        childTouch = parentTouch;
        parent = parent.mParent;
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