var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');
var _data = require('scenes/game/gamedata.js');
var _button = require('widget/button.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;

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
    this.setSize(button.getSize());

    this.mCount = _global.textNode('Georgia', 24, count + '');
    this.mCount.setAnthor(0.5, 0.5);
    this.mCount.setPosition(edge / 2, edge / 2);
    this.addChild(this.mCount);
}
_inherit(BeltButton, _UIContainer);

function BeltSlots(unit, count) {
    _UIContainer.call(this);

    this.mUnit = unit;
    this.mCount = 5;
    this.mMultip = [];
    for (var i = 0; i < this.mCount; i++) {
        var b = new BeltButton(i, unit, count + '');
        this.mMultip.push(b);
        this.addChild(b);
    }
    this.layout();
}
_inherit(BeltSlots, _UIContainer);
BeltSlots.prototype.layout = function () {
    var x = 0;
    for (var i = 0; i < this.mCount; i++) {
        _relative.layout(this.mMultip[i], 0, 0, x, 0);
        x += this.mUnit + 2;
    }
    this.setSize(x, this.mUnit);
}

function BetPanel(game) {
    _UIContainer.call(this);
    this.game = game;

    this.setSize(WIDTH, HEIGHT);
    this.addChild(this.bg = _global.colorNode([40 / 255, 42 / 255, 45 / 255, 1], WIDTH, HEIGHT));

    //this.mBeltLabel = _global.textNode('', 20, '');
    this.mBeltSlots = new BeltSlots(34, 20);
    this.mBeltSlots.setAnthor(0.5, 0);
    this.addChild(this.mBeltSlots);
    this.resize(WIDTH);
}
_inherit(BetPanel, _UIContainer);
BetPanel.prototype.resize = function (width) {
    this.bg.setSize(width, HEIGHT);
    this.setSize(width, HEIGHT);

    _relative.local.layoutTo(this.mBeltSlots, 0.5, 0, this, 0.5, 0);
}

module.exports = BetPanel;