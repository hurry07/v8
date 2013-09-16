var _inherit = require('core/inherit.js');
var _Element = require('component/element.js').prototype;
var _geometry = require('core/glm.js');
var _Matrix = _geometry.matrix4;
var _glm = _geometry.glm;

var _Node = require('component/node.js');
var FlagTouchMatrix = _Node.prototype.FlagTouchMatrix;
var FlagTouchMatrixInverse = _Node.prototype.FlagTouchMatrixInverse;

var TypeEventNode = 1;
var TypeTouchNode = 1 << 1;

function EventNode(element) {
    this.element = element;
    this.children = [];
    this.parent = null;
    this.matrix = new _Matrix();// matrix to root
    this.matrixInverse = new _Matrix();// reverse of matrix
}
EventNode.prototype.type = TypeEventNode;
EventNode.prototype.addChild = function (child) {
    this.children.push(child);
    child.parent = this;
    child.element.addFlag(FlagTouchMatrix);
    child.element.addFlag(FlagTouchMatrixInverse);
}
EventNode.prototype.removeChild = function (child) {
    var index = this.indexOf(child);
    if (index != -1) {
        this.children.splice(index, 1);
        child.parent = null;
    }
}
EventNode.prototype.moveToEnd = function (index, child) {
    this.children.splice(index, 1);
    this.children.push(child);
}
EventNode.prototype.indexOf = function (child) {
    for (var i = -1, arr = this.children, l = arr.length; ++i < l;) {
        if (arr[i] === child) {
            return i;
        }
    }
    return -1;
}
EventNode.prototype.enterNode = function (dirty, stack) {
    var nDirty = this.element.getRemove(FlagTouchMatrix);
    if (nDirty || dirty) {
        this.matrix.set(stack.push(this.element.getMatrix(this.matrix)));
    } else {
        stack.pushNext(this.matrix);
    }
    return nDirty;
}
EventNode.prototype.isReachable = function () {
    return this.type == TypeTouchNode || this.children.length > 0;
}
EventNode.prototype.isTouchable = function () {
    return this.type == TypeTouchNode;
}
EventNode.prototype.onEvent = function (context) {
}
EventNode.prototype.startItor = function () {
    this.index = -1;
}
EventNode.prototype.head = function () {
    this.index = 0;
}
EventNode.prototype.hasNext = function () {
    return this.index < this.children.length;
}
EventNode.prototype.next = function () {
    return this.children[this.index++];
}
EventNode.prototype.childrenCount = function () {
    return this.children.length;
}
EventNode.prototype.getIndex = function () {
    return this.index;
}
EventNode.prototype.print = function (prefix) {
    prefix = prefix || '';
    if (this.children.length == 0) {
        console.log(prefix + this.element);
        return;
    }

    var header = prefix + '    ';
    console.log(prefix + this.element + ': {');
    for (var i = -1, arr = this.children, l = arr.length; ++i < l;) {
        arr[i].print(header);
    }
    console.log(prefix + '}');
}

function TouchNode(element) {
    EventNode.call(this, element);
}
_inherit(TouchNode, EventNode);
TouchNode.prototype.type = TypeTouchNode;
TouchNode.prototype.onEvent = function () {
}

// ========================================================
// Listener
// ========================================================
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
    var parentTouch = parent.__touchnode__;
    var childTouch = child.__touchnode__;
    parentTouch.removeChild(childTouch);

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
            parentTouch.moveToEnd(index, childTouch);
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