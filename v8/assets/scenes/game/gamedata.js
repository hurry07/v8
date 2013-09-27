var Data = {
}
var BeltData = {
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

module.exports = new GameData();