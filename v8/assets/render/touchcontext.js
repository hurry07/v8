var _LinkedList = require('core/linkedlist.js').LinkedList;
var _event = require('core/event.js');

var mTouchEvent = _event.touchEvent;
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

// ========================================================
// TouchContext
// ========================================================
function TouchContext() {
//    this.events = new _LinkedList();
    this.events = [];
    this.buffer = new Int32Array(4 * 64);
}
TouchContext.prototype.clear = function () {
    this.events = [];
}
/**
 * get event as much as possiable
 */
TouchContext.prototype.pullEvents = function () {
    var buf = this.buffer;
    var count = mTouchEvent.getEvents(buf);
    for (var i = 0; i < count; i++) {
        this.events.addNode(new TouchEvent(0).init(buf, 4 * i));
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