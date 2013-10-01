// ==========================
// Match FirstNode
// ==========================
function NodeListener(matches, level) {
    this.resetMatch(matches, level);
}
NodeListener.prototype.resetMatch = function (matches, level) {
    this.mMatch = matches;
    this.mCount = 0;
    this.level = level;
}
NodeListener.prototype.onNode = function (cssnode) {
    if (this.mMatch.match(cssnode.node)) {
        cssnode.isMatch = true;
        cssnode.matchChildren++;
        this.mCount++;
    }
}
NodeListener.prototype.onVisit = function (cssnode) {
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

function CascadListener(matcher, level) {
}

module.exports = NodeListener;
