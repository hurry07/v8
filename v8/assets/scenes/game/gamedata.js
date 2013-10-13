var Data = {
}
var BeltData = {
    basicbet: 20,
    maxbet: 10,
    multip: 5
}

function GameData() {
    this.level = 0;
}
GameData.prototype.getData = function (name) {
    return Data[name];
}
GameData.prototype.getGameConf = function () {
    return {
        row: 7, col: 6, minmatch: 3, unitwidth: 50, headers: 1
    }
}

// ==========================
// ==========================
function Belt() {
    this.multip = 1;
    this.bet = 1;
    this.cost = this.bet * BeltData.basicbet;

    this.total = 500;
    this.current = 20;
}
Belt.prototype.getBet = function () {
    return this.bet * BeltData.basicbet;
}
Belt.prototype.updateCost = function () {
    var mul = this.bet * BeltData.basicbet;
    this.cost = mul * this.multip;
    return mul;
}
Belt.prototype.increaseBet = function () {
    this.bet++;
    if (this.bet > BeltData.maxbet) {
        this.bet = BeltData.maxbet;
    }
    return this.updateCost();
}
Belt.prototype.decreaseBet = function () {
    this.bet--;
    if (this.bet <= 0) {
        this.bet = 1;
    }
    return this.updateCost();
}
Belt.prototype.getMultipCount = function () {
    return BeltData.multip;
}
Belt.prototype.setMultip = function (i) {
    this.multip = i + 1;
    this.updateCost();
}
Belt.prototype.getCost = function () {
    return this.cost;
}
Belt.prototype.spend = function (cost) {
    this.total -= cost;
}
/**
 * @returns {number}
 */
Belt.prototype.getTotal = function () {
    return this.total;
}
Belt.prototype.getCurrent = function () {
    return this.current;
}
Belt.prototype.getCurrent = function () {
    return this.current;
}

exports.gamedata = new GameData();
exports.beltdata = new Belt();