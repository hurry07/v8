// ==========================
// Match FirstNode
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
        cssnode.isMatch = true;
        cssnode.matchChildren++;
        this.mCount++;
    }
}
NodeListener.prototype.onVisit= function (cssnode) {
    return true;
}
NodeListener.prototype.onPush = function (cssnode) {
    cssnode.isMatch = false;
    cssnode.matchChildren = this.mCount;
}
NodeListener.prototype.onPop = function (cssnode) {
    cssnode.matchChildren = this.mCount - cssnode.matchChildren;
    if (!cssnode.isReachable()) {
        cssnode.removeFromParent();
    }
}

module.exports = NodeListener;
