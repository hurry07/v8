var Data = {
}
var BeltData = {
    rate: 20,
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
}
Belt.prototype.getRate = function () {
    return BeltData.rate;
}
Belt.prototype.getMultip = function () {
    return BeltData.multip;
}

exports.gamedata = new GameData();
exports.beltdata = new Belt();