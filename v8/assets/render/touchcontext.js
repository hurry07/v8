var _LinkedList = require('core/linkedlist.js').LinkedList;
var _event = require('core/event.js');
var _Matrix = require('core/glm.js').matrix4;

var mTouchEvent = _event.touchEvent;// get events data from native
var mKeyEvent = _event.keyEvent;

// ========================================================
// TouchEvent
// ========================================================
function TouchEvent(time) {
//    this._prev = null;// previous
//    this._next = null;// next
    this.time = time;
    this.button = 0;
    this.state = 0;
    this.x = 0;
    this.y = 0;
}
TouchEvent.prototype.init = function (buffer, offset) {
    this.button = buffer[offset];
    this.state = buffer[offset + 1];
    this.x = buffer[offset + 2];
    this.y = buffer[offset + 3];
    return this;
}
TouchEvent.prototype.toString = function () {
    return '{' + [
        'time:' + this.time,
        'button:' + this.button,
        'state:' + this.state,
        'x:' + this.x,
        'y:' + this.y
    ].join(',') + '}';
}

function NodeStack() {
    this.depth = 0;
    this.nodes = [];
    this.matrix = new _Matrix();
    this.dirty = true;
    this.nodesCount = 0;
    this.nodesAccess = 0;
}
NodeStack.prototype.push = function (node) {
    node.startItor();
    this.nodes[this.depth++] = node;
}
NodeStack.prototype.pop = function () {
    this.depth--;
}
NodeStack.prototype.clear = function () {
    this.depth = 0;
    this.matrix.identity();
}
NodeStack.prototype.startItor = function (dirty, pvm, rootnode) {
    this.depth = 0;
    this.dirty = dirty;
    this.nodesCount = 1;
    this.nodesAccess = 0;
    this.matrix.set(pvm);

    this.push(rootnode);
}
NodeStack.prototype.isEmpty = function () {
    return this.nodesAccess == this.nodesCount;
}
NodeStack.prototype.next = function () {
    var node = this.nodes[this.depth - 1];
    if (node.getIndex() == -1) {
        node.head();
        this.nodesCount += node.childrenCount();
        this.nodesAccess++;
        return node;
    }

    if (node.hasNext()) {
        this.push(node.next());
        return this.next();
    }

    this.pop();
    return this.next();
}

// ========================================================
// TouchContext
// ========================================================
function TouchContext() {
//    this.events = new _LinkedList();
    this.events = [];
    this.buffer = new Int32Array(4 * 64);
    this.mDirty = true;
    this.mStack = new NodeStack();
}
TouchContext.prototype.isDirty = function () {
    return this.mDirty;
}
TouchContext.prototype.setDirty = function (d) {
    this.mDirty = d;
}
TouchContext.prototype.endTouch = function () {
    this.events = [];
    this.mDirty = false;
}
TouchContext.prototype.onEvent = function (pvm, scene) {
    var stack = this.mStack;
    stack.startItor(this.mDirty, pvm, scene.__touchnode__);

    while (!stack.isEmpty()) {
        var node = stack.next();
        console.log('--->', node.node);
    }
}
/**
 * get event as much as possiable
 */
TouchContext.prototype.pullEvents = function () {
    var buf = this.buffer;
    var count = mTouchEvent.getEvents(buf);
    for (var i = 0; i < count; i++) {
        this.events.push(new TouchEvent(0).init(buf, 4 * i));
//        var e = new TouchEvent(0).init(buf, 4 * i);
//        console.log(e);
//        this.events.push(e);
    }
}
TouchContext.prototype.isEmpty = function () {
//    return this.events.isEmpty();
    return this.events.length == 0;
}
TouchContext.prototype.pop = function () {
//    var e = this.events;
//    var first = e.first();
//    if (e.isTail(first)) {
//        return null;
//    }
//    e.removeNode(first);
    return this.events.shift();
}
TouchContext.prototype.peek = function () {
//    var e = this.events;
//    var first = e.first();
//    if (e.isTail(first)) {
//        return null;
//    }
//    return first;
    return this.events[0];
}

module.exports = TouchContext;