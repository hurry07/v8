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
    this.mNext = this.mCursor = this.anthor;
    return this;
}
LinkedList.prototype.hasNext = function () {
    return (this.mCursor = this.mNext).next !== this.anthor;
}
LinkedList.prototype.next = function () {
    return this.mNext = this.mCursor.next;
}
LinkedList.prototype.remove = function () {
    this.remove(this.mCursor);
}

module.exports = LinkedList;
module.exports.Node = Node;