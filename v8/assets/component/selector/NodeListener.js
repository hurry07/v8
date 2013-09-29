// ==========================
// Node Iterator
// ==========================
function NodeListener(matches) {
    this.resetMatch(matches);
}
NodeListener.prototype.resetMatch = function (matches) {
    this.mMatch = matches;
    this.mCount = 0;
}
NodeListener.prototype.onNode = function (cssnode) {
    if (this.mMatch.match(cssnode.node)) {
        this.mCount++;
    }
}
NodeListener.prototype.onPush = function (cssnode) {
    cssnode.matches = this.mCount;
}
NodeListener.prototype.onPop = function (cssnode) {
    cssnode.matches = this.mCount - cssnode.matches;
}

module.exports = NodeListener;
