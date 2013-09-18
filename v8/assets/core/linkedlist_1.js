// ==========================
// Node
// ==========================
function Node(data) {
    this.next = this.previous = null;
    this.data = data;
    this.mList = null;
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
LinkedList.prototype.clear = function () {
    var start = this.anthor;
    while ((start = start.next) != this.anthor) {
        start.mList = null;
        console.log(start);
    }
    this.anthor.previous = this.anthor.next = this.anthor;
    this.mCount = 0;
}
LinkedList.prototype.add = function (cell) {
    var p = cell.mList;
    if (p) {
        if (p === this) {
            return;
        } else {
            // a node can only belongs to one list
            p.remove(cell);
        }
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
    g.onMerge();

    while (start != anthor) {
        start.mList = this;
        start = start.next;
    }
}
LinkedList.prototype.count = function () {
    return this.mCount;
}
LinkedList.prototype.first = function () {
    if (this.mCount == 0) {
        return null;
    }
    return this.anthor.next;
}
LinkedList.prototype.last = function () {
    if (this.mCount == 0) {
        return null;
    }
    return this.anthor.previous;
}
LinkedList.prototype.onMerge = function () {
}
LinkedList.prototype.toString = function () {
    return 'group {count:' + this.mCount + '}';
}

module.exports = LinkedList;
module.exports.Node = Node;