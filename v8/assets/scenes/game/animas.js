function FallAnima() {
    this.mFinish = true;
    this.mGroups = null;
    this.mTotalTime = 0;
    this.mTime = 0;
}
FallAnima.prototype.reset = function () {
    this.mFinish = false;
    this.mTime = this.mTotalTime = 0;
}
FallAnima.prototype.update = function (step) {
    this.mTime += step;
    return this.mFinish = this.mTime >= this.mTotalTime;
}
FallAnima.prototype.timeleft = function (step) {
    return this.mTime - this.mTotalTime;
}
FallAnima.prototype.isFinish = function (step) {
    return this.mFinish;
}

function CompactAnima() {
    this.mFinish = true;
    this.mGroups = null;
    this.mTotalTime = 0;
    this.mTime = 0;
}
CompactAnima.prototype.reset = function () {
    this.mFinish = false;
    this.mTime = this.mTotalTime = 0;
}
CompactAnima.prototype.update = function (step) {
    this.mTime += step;
    return this.mFinish = this.mTime >= this.mTotalTime;
}
CompactAnima.prototype.timeleft = function (step) {
    return this.mTime - this.mTotalTime;
}

function ClearAnima() {
    this.mFinish = true;
    this.mGroups = null;
    this.mTotalTime = 0;
    this.mTime = 0;
}
ClearAnima.prototype.reset = function () {
    this.mFinish = false;
    this.mTime = this.mTotalTime = 0;
}
ClearAnima.prototype.update = function (step) {
    this.mTime += step;
    return this.mFinish = this.mTime >= this.mTotalTime;
}
ClearAnima.prototype.timeleft = function (step) {
    return this.mTime - this.mTotalTime;
}

function DropAnima() {
    this.mFinish = true;
    this.mGroups = null;
    this.mTotalTime = 0;
    this.mTime = 0;
}
DropAnima.prototype.reset = function () {
    this.mFinish = false;
    this.mTime = this.mTotalTime = 0;
}
DropAnima.prototype.update = function (step) {
    this.mTime += step;
    return this.mFinish = this.mTime >= this.mTotalTime;
}
DropAnima.prototype.timeleft = function (step) {
    return this.mTime - this.mTotalTime;
}

exports.FallAnima = FallAnima;
exports.CompactAnima = CompactAnima;
exports.ClearAnima = ClearAnima;
exports.DropAnima = DropAnima;