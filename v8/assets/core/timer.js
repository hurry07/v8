function Timer() {
    this.lasttime = 0;
    this.reset();
}
Timer.prototype.reset = function () {
    this.lasttime = new Date().getTime();
}
Timer.prototype.getTimePass = function () {
    var delt = new Date().getTime();
    var seconds = (delt - this.lasttime) / 1000;
    this.lasttime = delt;
    return seconds;
}

module.exports = Timer;