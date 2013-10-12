var _inherit = require('core/inherit.js');

function _update(step) {
    this.mTime += step;
    return this.mFinish = this.mTime >= this.mTotalTime;
}
function _reset(time) {
    this.mTime = 0;
    this.mTotalTime = time;
    this.mFinish = false;
}
function Anima() {
    this.mTime = 0;
    this.mTotalTime = 0;
    this.mFinish = true;
}
Anima.prototype.update = _update;
Anima.prototype.reset = _reset;
Anima.prototype.timeleft = function (step) {
    return this.mTime - this.mTotalTime;
}
Anima.prototype.isFinish = function () {
    return this.mFinish;
}

// ==========================
// FallAnima
// ==========================
function FallAnima() {
    Anima.call(this);
    this.mGroups = null;
}
_inherit(FallAnima, Anima);

// ==========================
// CompactAnima
// ==========================
function CompactAnima() {
    Anima.call(this);
    this.mGroups = null;
}
_inherit(CompactAnima, Anima);

// ==========================
// ClearAnima
// ==========================
function ClearAnima() {
    Anima.call(this);
    this.mGroups = null;
}
_inherit(ClearAnima, Anima);

// ==========================
// RemoveAnima
// ==========================
function RemoveAnima() {
    Anima.call(this);
    this.mGroups = null;
}
_inherit(RemoveAnima, Anima);
RemoveAnima.prototype.reset = function (groups) {
    _reset.call(this, 1);
    this.mGroups = groups;
}
RemoveAnima.prototype.update = function (step) {
    var f = _update.call(this, step);
    if (f) {
        var group = this.mGroups.first();
        console.log('update', group);
        this.mGroups.remove(group);
        var itor = group.iterator();
        while (itor.hasNext()) {
            itor.next().visiable(false);
        }
        if (this.mGroups.count() > 0) {
            this.mTotalTime += 1;
            this.mFinish = this.mTime >= this.mTotalTime;
        }
    }
    return this.mFinish;
}

exports.FallAnima = FallAnima;
exports.CompactAnima = CompactAnima;
exports.ClearAnima = ClearAnima;
exports.RemoveAnima = RemoveAnima;