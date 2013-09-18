var _scene = require('component/scene.js');
var _GameArea = require('scenes/game/gamearea.js');
var _BetPanel = require('scenes/game/betpanel.js');
var _MessagePanel = require('scenes/game/messagepanel.js');
var _layout = require('tools/layout.js');
var _config = require('scenes/game/gamedata.js');
var _relative = _layout.relative;

var Game = _scene.createScene(
    function (w, h) {
        this.setSize(w, h);
        this.addChild(this.gamearea = new _GameArea(this, _config.getGameConf()));
        this.addChild(this.betpanel = new _BetPanel(this));
        this.addChild(this.msgpanel = new _MessagePanel(this));

        this.onSizeChange(w, h);
    }
);

Game.prototype.update = function (context) {
    this.gamearea.startNextRound();
    this.gamearea.update(context);
}
Game.prototype.onSizeChange = function (w, h) {
    this.setSize(w, h);

    var wideleft = (w - this.gamearea.width()) / 2;
    this.betpanel.resize(wideleft);
    this.msgpanel.resize(wideleft);

    _relative.layout(this.betpanel, 0, 0, 0, 0);
    _relative.layout(this.gamearea, 0, 0, wideleft, 0);
    _relative.layoutTo(this.msgpanel, 0, 0, this.gamearea, 1, 0);
}
Game.prototype.layout = function () {
}
/**
 * find an cell group
 * @param groups
 */
Game.prototype.onGroupFind = function (groups) {
}

module.exports = Game;