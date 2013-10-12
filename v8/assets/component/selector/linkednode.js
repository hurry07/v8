function Node() {
    this.previous = this.next = this;
}
// ==========================
// LinkedList
// ==========================
function LinkedList() {
    this.anthor = new Node();
    this.anthor.previous = this.anthor.next = this.anthor;
    this.mCount = 0;

    this.startItor();
}
LinkedList.prototype.clear = function () {
    this.anthor.previous = this.anthor.next = this.anthor;
    this.mCount = 0;
}
LinkedList.prototype.addNode = function (cell) {
    var anthor = this.anthor;
    cell.previous = anthor.previous;
    cell.next = anthor;
    anthor.previous.next = cell;
    anthor.previous = cell;

    this.mCount++;
}
LinkedList.prototype.removeNode = function (cell) {
    cell.previous.next = cell.next;
    cell.next.previous = cell.previous;

    this.mCount--;
}
LinkedList.prototype.isAnchor = function (cell) {
    return cell === this.anthor;
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
LinkedList.prototype.toString = function () {
    return 'group {count:' + this.mCount + '}';
}
LinkedList.prototype.isEmpty = function () {
    return this.mCount == 0;
}
// ==========================
// Iterator
// ==========================
LinkedList.prototype.startItor = function () {
    this.mCursor = this.anthor;
    this.mNext = this.anthor.next;
    return this;
}
LinkedList.prototype.hasNext = function () {
    if (this.mNext === this.anthor) {
        return false;
    }
    this.mCursor = this.mNext;
    return true;
}
LinkedList.prototype.next = function () {
    this.mNext = this.mCursor.next;
    return this.mCursor;
}
LinkedList.prototype.remove = function () {
    this.mNext = this.mCursor.next;
    this.remove(this.mCursor);
}

module.exports = LinkedList;
module.exports.Node = Node;