function Timer() {
    this.lasttime = 0;
    this.reset();
}
Timer.prototype.reset = function () {
    this.lasttime = new Date().getTime();
    this.timepass = 0;
}
Timer.prototype.ticktack = function () {
    var delt = new Date().getTime();
    this.timepass = (delt - this.lasttime) / 1000;
    this.lasttime = delt;
}
Timer.prototype.getTimePass = function () {
    return this.timepass;
}
Timer.prototype.getTime = function() {
    return this.lasttime;
}

module.exports = Timer;