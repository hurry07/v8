var Data = {
}
var BeltData = {
    betcount: 20,
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
        row: 7, col: 6, minmatch: 3, unitwidth: 50
    }
}

function Belt() {
    this.multip = 1;
    this.basebet = BeltData.betcount;
    this.bet = BeltData.betcount;
}
Belt.prototype.getBetCount = function () {
    return BeltData.betcount;
}
Belt.prototype.getBet = function () {
    return this.bet;
}
Belt.prototype.setBet = function (b) {
}
Belt.prototype.getMultipCount = function () {
    return BeltData.multip;
}

exports.gamedata = new GameData();
exports.beltdata = new Belt();