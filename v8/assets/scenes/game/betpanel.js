var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');
var _model = require('scenes/game/gamedata.js').beltdata;
var _button = require('widget/button.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;

var WIDTH = 220;
var HEIGHT = 400;

function blockButton(id, edge) {
    var p1 = _global.colorNode([1, 0, 0, 1], edge, edge);
    var p2 = _global.colorNode([1, 1, 0, 1], edge, edge);
    var bt = _button.createButtonWithId(id, p1, p2);
    return bt;
}

function BeltButton(id, edge, content) {
    _UIContainer.call(this);

    var button = blockButton(id, edge);
    this.addChild(button);
    this.setSize(button.getSize());

    this.mCount = _global.textNode('Georgia', 24, content);
    this.mCount.setAnthor(0.5, 0.5);
    this.mCount.setPosition(edge / 2, edge / 2);
    this.addChild(this.mCount);
}
_inherit(BeltButton, _UIContainer);
BeltButton.prototype.setText = function (str) {
    this.mCount.setText(str);
}

/**
 * @param tag
 * @param unit edge of each button
 * @param count button count
 * @constructor
 */
function ButtonSlots(tag, unit, count) {
    _UIContainer.call(this);

    this.mTag = tag;
    this.mUnit = unit;
    this.mButtons = [];
    for (var i = 0; i < count; i++) {
        var b = new BeltButton(i, unit, 'X' + (i + 1));
        this.mButtons.push(b);
        this.addChild(b);
    }
    this.layout();
}
_inherit(ButtonSlots, _UIContainer);
ButtonSlots.prototype.layout = function () {
    var x = 0;
    for (var i = 0, count = this.mButtons.length; i < count; i++) {
        _relative.layout(this.mButtons[i], 0, 0, x, 0);
        x += this.mUnit + 2;
    }
    this.setSize(x - 2, this.mUnit);
}

/**
 * @param tag
 * @param unit
 * @param count
 * @constructor
 */
function BeltChange(tag, unit, basebet) {
    _UIContainer.call(this);
    this.mTag = tag;
    this.mUnit = unit;
    this.mLeft = new BeltButton('<', unit, '<');
    this.mRight = new BeltButton('>', unit, '>');
    this.mBelt = _global.textNode('Georgia', 24, basebet + '');
    this.mBelt.setAnthor(0.5, 0.5);

    this.addChild(this.mLeft);
    this.addChild(this.mRight);
    this.addChild(this.mBelt);
    this.setSize(5 * unit + 8, unit);
    this.layout();
}
_inherit(BeltChange, _UIContainer);
BeltChange.prototype.layout = function () {
    _relative.layout(this.mLeft, 0, 0, 0, 0);
    _relative.local.layoutTo(this.mRight, 1, 0, this, 1, 0);
    _relative.local.layoutTo(this.mBelt, 0.5, 0.5, this, 0.5, 0.5);
}
BeltChange.prototype.setText = function (str) {
    this.mBelt.setText(str + '');
}

function BetPanel(game) {
    _UIContainer.call(this);
    this.game = game;

    this.setSize(WIDTH, HEIGHT);
    this.addChild(this.bg = _global.colorNode([1, 0, 1, 1], WIDTH, HEIGHT));

    this.mMultip = new ButtonSlots('multip', 34, _model.getMultipCount());
    this.mMultip.setAnthor(0.5, 0);
    this.addChild(this.mMultip);

    this.mBet = new BeltChange('belts', 34, _model.getBet());
    this.mBet.setAnthor(0.5, 0);
    this.addChild(this.mBet);

    this.querySelector('multip button').forEach(function (button) {
        button.on('click', this.multipclick, this);
    }, this);
    this.querySelector('belts button').forEach(function (button) {
        button.on('click', this.beltclick, this);
    }, this);
    this.resize(WIDTH);
}
_inherit(BetPanel, _UIContainer);
BetPanel.prototype.multipclick = function (button) {
    _model.setMultip(button.getId());
    console.log('cost', _model.getCost());
}
BetPanel.prototype.beltclick = function (button) {
    if (button.getId() == '>') {
        this.mBet.setText(_model.increaseBet());
    } else {
        this.mBet.setText(_model.decreaseBet());
    }
    console.log('cost', _model.getCost());
}
BetPanel.prototype.resize = function (width) {
    this.bg.setSize(width, HEIGHT);
    this.setSize(width, HEIGHT);

    _relative.local.layoutTo(this.mMultip, 0.5, 0, this, 0.5, 0.5);
    _relative.layoutTo(this.mBet, 0.5, 0, this.mMultip, 0.5, 1, 0, 2);
}

module.exports = BetPanel;