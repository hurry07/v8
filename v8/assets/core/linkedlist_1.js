// ==========================
// Node
// ==========================
function Node(data) {
    this.next = this.previous = null;
    this.mList = null;
    this.data = data;
}

// ==========================
// Iterator
// ==========================
function Iter(group) {
    this.mNext = this.mStart = this.mEnd = null;
    this.group = group;
}
Iter.prototype.init = function (start, end) {
    this.mNext = this.mStart = start;
    this.mEnd = end;
    return this;
}
Iter.prototype.hasNext = function () {
    this.mStart = this.mNext;
    return this.mStart.next != this.mEnd;
}
Iter.prototype.next = function () {
    this.mNext = this.mStart.next;
    return this.mStart.next;
}
Iter.prototype.remove = function () {
    this.group.remove(this.mStart.next);
}

// ==========================
// Group
// ==========================
function LinkedList() {
    this.anthor = new Node(this);
    this.anthor.mList = this;
    this.anthor.previous = this.anthor.next = this.anthor;
    this.iter = new Iter(this);
    this.mCount = 0;
}
LinkedList.prototype.iterator = function () {
    return this.iter.init(this.anthor, this.anthor);
}
LinkedList.prototype.add = function (cell) {
    if (cell.mList === this) {
        return;
    }
    this.__insert(cell);
}
LinkedList.prototype.__insert = function (cell) {
    var anthor = this.anthor;
    cell.previous = anthor.previous;
    cell.next = anthor;
    anthor.previous.next = cell;
    anthor.previous = cell;
    this.mCount++;

    cell.mList = this;
}
LinkedList.prototype.remove = function (cell) {
    cell.previous.next = cell.next;
    cell.next.previous = cell.previous;

    cell.mList = null;
    this.mCount--;
}
/**
 * move node from one group to another
 * @param g
 */
LinkedList.prototype.merge = function (g) {
    if (g.mCount == 0 || g === this) {
        return;
    }

    var start = g.anthor.next;
    var cell = start;
    var anthor = this.anthor;

    anthor.previous.next = cell;
    cell.previous = anthor.previous;

    cell = g.anthor.previous;
    cell.next = anthor;
    anthor.previous = cell;

    g.anthor.next = g.anthor.previous = g.anthor;
    this.mCount += g.mCount;
    g.mCount = 0;

    while (start != anthor) {
        start.mList = this;
        start = start.next;
    }
}
LinkedList.prototype.count = function () {
    return this.mCount;
}
LinkedList.prototype.first = function () {
    if (count == 0) {
        return null;
    }
    return this.anthor.next;
}
LinkedList.prototype.last = function () {
    if (count == 0) {
        return null;
    }
    return this.anthor.previous;
}
LinkedList.prototype.toString = function () {
    return 'group {count:' + count + '}';
}

module.exports = LinkedList;
module.exports.Node = Node;