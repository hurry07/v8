var Data = {
};
var BeltData = {
    basicbet: 20,
    maxbet: 10,
    multip: 5
};
var Levels = [
    {
        min: 4,
        length: 11,
        types: [
            {
                name: 'baiyu',
                count: [2, 4, 5, 8, 10, 20, 30, 50, 100, 200, 400]
            },
            {
                name: 'biyu',
                count: [4, 5, 10, 20, 30, 50, 100, 250, 500, 750, 800]
            },
            {
                name: 'moyu',
                count: [5, 10, 20, 40, 80, 160, 500, 1000, 2000, 5000, 6000]
            },
            {
                name: 'manao',
                count: [10, 30, 50, 60, 100, 750, 1000, 10000, 20000, 50000, 60000]
            },
            {
                name: 'hupo',
                count: [20, 50, 100, 500, 1000, 2000, 5000, 20000, 50000, 60000, 80000]
            }
        ]
    },
    {
        min: 5,
        length: 11,
        types: [
            {
                name: 'zumulv',
                count: [2, 4, 5, 8, 10, 20, 30, 50, 100, 200, 450]
            },
            {
                name: 'maoyanshi',
                count: [4, 5, 10, 20, 30, 50, 100, 250, 500, 750, 1000]
            },
            {
                name: 'zishuijing',
                count: [5, 10, 20, 40, 80, 160, 500, 1000, 2000, 5000, 7000]
            },
            {
                name: 'feicui',
                count: [10, 30, 50, 60, 100, 750, 1000, 10000, 20000, 50000, 70000]
            },
            {
                name: 'zhenzhu',
                count: [20, 50, 100, 500, 1000, 2000, 5000, 20000, 50000, 80000, 100000]
            }
        ]
    },
    {
        min: 6,
        length: 11,
        types: [
            {
                name: 'hongbaoshi',
                count: [2, 4, 5, 8, 10, 20, 30, 50, 100, 200, 500]
            },
            {
                name: 'lvbaoshi',
                count: [4, 5, 10, 20, 30, 50, 100, 250, 500, 750, 1200]
            },
            {
                name: 'huangbaoshi',
                count: [5, 10, 20, 40, 80, 160, 500, 1000, 2000, 5000, 8000]
            },
            {
                name: 'lanbaoshi',
                count: [10, 30, 50, 60, 100, 750, 1000, 10000, 20000, 50000, 80000]
            },
            {
                name: 'zuanshi',
                count: [20, 50, 100, 500, 1000, 2000, 5000, 20000, 50000, 100000, 100000]
            }
        ]
    }
];

// ==========================
// LevelConf
// ==========================
function LevelConf(levels) {
    this.maxlevel = levels.length;
    this.level = 0;
    this.resetLevel(levels[0]);
}
LevelConf.prototype.reset = function () {
    this.level = 0;
    this.resetLevel(Levels[this.level]);
};
LevelConf.prototype.resetLevel = function (level) {
    this.minmatch = level.min;
    this.maxmatch = level.min + level.length;
    this.types = level.types;
    this.typecount = this.types.length;
};
LevelConf.prototype.isFinish = function () {
    return this.level == this.maxlevel - 1;
};
LevelConf.prototype.nextLevel = function () {
    this.level++;
    this.resetLevel(Levels[this.level]);
};
LevelConf.prototype.getGains = function (count, type) {
    if (count >= this.maxlevel) {
        return this.types[type].count[this.maxmatch - this.minmatch - 1] * count;
    }
    return this.types[type].count[count - this.minmatch] * count;
};
LevelConf.prototype.initCell = function (cell) {
    cell.setData(Math.floor(Math.random() * this.typecount));
};
LevelConf.prototype.getMinMatch = function (cell) {
    return this.minmatch;
};

// ==========================
// GameData
// ==========================
function GameData() {
    this.level = 0;
}
GameData.prototype.getData = function (name) {
    return Data[name];
};
GameData.prototype.getGameConf = function () {
    return {
        row: 7, col: 6, unitwidth: 50, headers: 1
    }
};

// ==========================
// Belt keeps bet coins
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
};
Belt.prototype.updateCost = function () {
    var mul = this.bet * BeltData.basicbet;
    this.cost = mul * this.multip;
    return mul;
};
Belt.prototype.increaseBet = function () {
    this.bet++;
    if (this.bet > BeltData.maxbet) {
        this.bet = BeltData.maxbet;
    }
    return this.updateCost();
};
Belt.prototype.decreaseBet = function () {
    this.bet--;
    if (this.bet <= 0) {
        this.bet = 1;
    }
    return this.updateCost();
};
Belt.prototype.getMultipCount = function () {
    return BeltData.multip;
};
Belt.prototype.setMultip = function (i) {
    this.multip = i + 1;
    this.updateCost();
};
Belt.prototype.getCost = function () {
    return this.cost;
};
Belt.prototype.spend = function (cost) {
    this.total -= cost;
};
/**
 * @returns {number}
 */
Belt.prototype.getTotal = function () {
    return this.total;
};
Belt.prototype.getCurrent = function () {
    return this.current;
};
Belt.prototype.getCurrent = function () {
    return this.current;
};

Belt.prototype.onMatch = function (count, type) {
    return this.total += count * (type + 1) * this.bet;
};

exports.gamedata = new GameData();
exports.beltdata = new Belt();
exports.levelconf = new LevelConf(Levels);