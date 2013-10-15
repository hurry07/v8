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
    this.mGroups = null;
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
}
_inherit(FallAnima, Anima);
FallAnima.prototype.reset = function (groups) {
    _reset.call(this, 1);
    this.mGroups = groups;
}
FallAnima.prototype.update = function (step) {
    var f = _update.call(this, step);
    if (f) {
        var itor = this.mGroups.iterator();
        while (itor.hasNext()) {
            var group = itor.next();
            var gitor = group.iterator();
            while (gitor.hasNext()) {
                gitor.next().visiable(true);
            }
        }
    }
    return f;
}

// ==========================
// CompactAnima
// ==========================
function CompactAnima() {
    Anima.call(this);
}
_inherit(CompactAnima, Anima);

// ==========================
// ClearAnima
// ==========================
function ClearAnima() {
    Anima.call(this);
}
_inherit(ClearAnima, Anima);

// ==========================
// RemoveAnima
// ==========================
function RemoveAnima(game) {
    Anima.call(this);
    this.mGame = game;
}
_inherit(RemoveAnima, Anima);
RemoveAnima.prototype.reset = function (groups) {
    _reset.call(this, 1);
    this.mGroups = groups;
    this.mIterator = groups.iterator();
}
RemoveAnima.prototype.update = function (step) {
    var f = _update.call(this, step);
    if (f) {
        var group = this.mIterator.next();
        var itor = group.iterator();
        while (itor.hasNext()) {
            itor.next().visiable(false);
        }
        this.mGame.onCellsMatch(group.count(), group.first().data);
        if (this.mIterator.hasNext()) {
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