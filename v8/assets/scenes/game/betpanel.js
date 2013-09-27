var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');
var _data = require('scenes/game/gamedata.js');
var _button = require('widget/button.js');

var WIDTH = 220;
var HEIGHT = 400;

function blockButton(id, edge) {
    var p1 = _global.colorNode([1, 0, 0, 1], edge, edge);
    var p2 = _global.colorNode([1, 0, 0, 1], edge, edge);
    var bt = _button.createButtonWithId(id, p1, p2);
    return bt;
}

function BeltButton(id, edge, count) {
    _UIContainer.call(this);

    var button = blockButton(id, edge);
    this.addChild(button);
    this.mCount = _global.textNode('Georgia', 40, count + '');
//    this.mCount.setAnthor(0.5, 0.5);
    this.mCount.setPosition(edge / 2, edge / 2);
    this.addChild(this.mCount);

    this.setSize(button.getSize());
}
_inherit(BeltButton, _UIContainer);

function BetPanel(game) {
    _UIContainer.call(this);
    this.game = game;

    this.setSize(WIDTH, HEIGHT);
//    this.addChild(this.bg = _global.colorNode([40 / 255, 42 / 255, 45 / 255, 1], WIDTH, HEIGHT));
    this.addChild(this.bg = _global.colorNode([1,1,1, 1], WIDTH, HEIGHT));

    this.mMultip = [];
    for (var i = 0; i < 5; i++) {
        var b = new BeltButton(1, 36, 'ABCDEabcde');
        this.mMultip.push(b);
        this.addChild(b);
    }

    this.resize(WIDTH);
}
_inherit(BetPanel, _UIContainer);
BetPanel.prototype.resize = function (width) {
    this.bg.setSize(width, HEIGHT);
    this.setSize(width, HEIGHT);
}

module.exports = BetPanel;