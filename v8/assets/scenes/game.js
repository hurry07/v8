var _scene = require('component/scene.js');
var _GameArea = require('scenes/game/gamearea.js');
var _BetPanel = require('scenes/game/betpanel.js');
var _MessagePanel = require('scenes/game/messagepanel.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;
var _model = require('scenes/game/gamedata.js').beltdata;
console.log('--->01');

var Game = _scene.createScene(
    function (w, h) {
        this.setSize(w, h);
        
        var _timer = require('core/timer.js');
		var tick = new _timer.TickTack();
    	this.addChild(this.gamearea = new _GameArea(this));
        tick.check('_GameArea.create');
        this.addChild(this.betpanel = new _BetPanel(this));
        tick.check('_BetPanel.create');
        this.addChild(this.msgpanel = new _MessagePanel(this));
        tick.check('_MessagePanel.create');

        this.querySelector('control>button').forEach(function (button) {
        	console.log('regist buttons', button);
            if (button.getId() == 'ok') {
                button.on('click', this.okClick, this);
            } else {
                button.on('click', this.autoClick, this);
            }
        }, this);
        tick.check('game.bindevent');

        this.mCoins = this.querySelector('#coinsbar')[0];

//        var text = _global.textNode('Georgia', 90, 'ABCDEabcde');
//        var text = _global.textNode('Georgia', 30, 'ABCDEabcde');
//        text.setPosition(50, 200);
//        this.addChild(text);
        this.onSizeChange(w, h);
        tick.check('game.onSizeChange');
    }
);
/**
 * start new round
 */
Game.prototype.okClick = function () {
    var cost = _model.getCost();
    var total = _model.getTotal();
    if (cost > total) {
        console.log('game over');
    } else {
        _model.spend(cost);
        this.mCoins.setTotal(_model.getTotal());
        this.gamearea.startNextRound();
    }
};
Game.prototype.autoClick = function () {
    console.log('autoClick');
    this.gamearea.goonGame();
};
Game.prototype.update = function (context) {
    this.gamearea.update(context.stride());
};
Game.prototype.onSizeChange = function (w, h) {
    this.setSize(w, h);

    var wideleft = (w - this.gamearea.width()) / 2;
    this.betpanel.resize(wideleft);
    this.msgpanel.resize(wideleft);

    _relative.layout(this.betpanel, 0, 0, 0, 0);
    _relative.layout(this.gamearea, 0, 0, wideleft, 0);
    _relative.layoutTo(this.msgpanel, 0, 0, this.gamearea, 1, 0);
};
Game.prototype.onCellsMatch = function (count, type) {
    console.log('onCellsMatch', count, type);
    this.mCoins.setTotal(_model.onMatch(count, type));
};
Game.prototype.layout = function () {
};
/**
 * find an cell group
 * @param groups
 */
Game.prototype.onGroupFind = function (groups) {
};
console.log('--->02');

module.exports = Game;