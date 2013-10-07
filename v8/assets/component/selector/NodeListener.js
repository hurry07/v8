var _inherit = require('core/inherit.js');

// ==========================
// SelecterListener
// ==========================
function SelecterListener() {
    this.targets = [];
}
SelecterListener.prototype.reset = function (selectors) {
    this.mCount = 0;
    this.selectors = selectors;
    return this;
}
SelecterListener.prototype.onVisit = function (cssnode) {
    return true;
}
SelecterListener.prototype.onNode = function (cssnode) {
    if (cssnode.depth == -1) {
        return;
    }
    if (this.selectors.match(cssnode.node)) {
        this.targets.push(cssnode.node);
        cssnode.target = true;
    }
}
SelecterListener.prototype.onPush = function (cssnode) {
    cssnode.branches = this.mCount;
}
SelecterListener.prototype.onPop = function (cssnode) {
    cssnode.branches = this.mCount - cssnode.branches;
    if (cssnode.branches == 0) {
        cssnode.removeFromParent();
        return;
    }
    if (cssnode.target) {
        cssnode.branches--;
    }
}

exports.SelecterListener = SelecterListener;
