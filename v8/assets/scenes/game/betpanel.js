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
    this.mCount.setAnchor(0.5, 0.5);
    this.mCount.setPosition(edge / 2, edge / 2);
    this.addChild(this.mCount);
}
_inherit(BeltButton, _UIContainer);
BeltButton.prototype.setText = function (str) {
    this.mCount.setText(str);
};

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
};

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
    this.mBelt.setAnchor(0.5, 0.5);

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
};
BeltChange.prototype.setText = function (str) {
    this.mBelt.setText(str + '');
};

/**
 * label:count
 *
 * @param title
 * @param split
 * @param width
 * @param height
 * @constructor
 */
function CoinsLabel(title, split, width, height) {
    _UIContainer.call(this);
    this.mSplit = split;
    this.mLabel = _global.textNode('Georgia', 24, title);
    this.mCount = _global.textNode('Georgia', 24, '0');
    this.mCount.setAnchor(0, 0);

    this.addChild(this.mLabel);
    this.addChild(this.mCount);
    this.setSize(width, height);
    this.layout();
}
_inherit(CoinsLabel, _UIContainer);
CoinsLabel.prototype.setText = function (str) {
    this.mCount.setText(str);
};
CoinsLabel.prototype.layout = function () {
    _relative.layout(this.mLabel, 1, 0, this.mSplit, 0);
    _relative.layout(this.mCount, 0, 0, this.mSplit, 0);
};

/**
 * total:0
 * current:0
 *
 * @constructor
 */
function CoinsBar() {
    var split = 90;
    var width = 100;
    var height = 50;

    _UIContainer.call(this);
    this.mId = 'coinsbar';
    this.addChild(this.mTotal = new CoinsLabel('Total:', split, width, height / 2));
    this.addChild(this.mCurrent = new CoinsLabel('Current:', split, width, height / 2));

    this.setSize(width, height);
    _relative.local.layoutTo(this.mCurrent, 0, 0, this, 0, 0);
    _relative.layoutTo(this.mTotal, 0, 0, this.mCurrent, 0, 1);
}
_inherit(CoinsBar, _UIContainer);
CoinsBar.prototype.setCost = function (cost) {
    this.mCurrent.setText(cost);
}
CoinsBar.prototype.setTotal = function (total) {
    this.mTotal.setText(total);
}
CoinsBar.prototype.setCoins = function (total, cost) {
    this.mTotal.setText(total);
    this.mCurrent.setText(cost);
};
CoinsBar.prototype.toString = function () {
    return '[coins bar]';
};

/**
 * OK Auto
 * @constructor
 */
function ControlButtons() {
    _UIContainer.call(this);
    this.mTag = 'control';

    var width = 170;
    var height = 35;
    var bwidth = 80;
    this.addChild(this.mOk = this.blockButton('OK', 'ok', bwidth, height));
    this.addChild(this.mAuto = this.blockButton('Auto', 'auto', bwidth, height));
    this.setSize(width, height);

    _relative.local.layoutTo(this.mOk, 0, 0, this, 0, 0);
    _relative.local.layoutTo(this.mAuto, 1, 0, this, 1, 0);
}
_inherit(ControlButtons, _UIContainer);
ControlButtons.prototype.blockButton = function (str, id, w, h) {
    var p1 = _global.colorNode([1, 0, 0, 1], w, h);
    var p2 = _global.colorNode([1, 1, 0, 1], w, h);
    var bt = _button.createButtonWithId(id, p1, p2);

    var label = _global.textNode('Georgia', 24, str);
    _relative.local.layoutTo(label, 0.5, 0.5, bt, 0.5, 0.5);
    bt.addChild(label);

    return bt;
};

/**
 * UI setup
 *
 * @param game
 * @constructor
 */
function BetPanel(game) {
    _UIContainer.call(this);
    this.game = game;

    this.setSize(WIDTH, HEIGHT);
    this.addChild(this.bg = _global.colorNode([1, 0, 1, 1], WIDTH, HEIGHT));

    this.mMultip = new ButtonSlots('multip', 34, _model.getMultipCount());
    this.mMultip.setAnchor(0.5, 0);
    this.addChild(this.mMultip);

    this.mBet = new BeltChange('belts', 34, _model.getBet());
    this.mBet.setAnchor(0.5, 0);
    this.addChild(this.mBet);

    this.addChild(this.mCounts = new CoinsBar());
    this.addChild(this.mControl = new ControlButtons());

    this.querySelector('multip button').forEach(function (button) {
        button.on('click', this.multipclick, this);
    }, this);
    this.querySelector('belts button').forEach(function (button) {
        button.on('click', this.beltclick, this);
    }, this);

    this.update();
    this.resize(WIDTH);
}
_inherit(BetPanel, _UIContainer);
BetPanel.prototype.multipclick = function (button) {
    _model.setMultip(button.getId());
    this.mCounts.setCost(_model.getCost());
};
BetPanel.prototype.beltclick = function (button) {
    if (button.getId() == '>') {
        this.mBet.setText(_model.increaseBet());
    } else {
        this.mBet.setText(_model.decreaseBet());
    }
    this.mCounts.setCost(_model.getCost());
};
BetPanel.prototype.resize = function (width) {
    this.bg.setSize(width, HEIGHT);
    this.setSize(width, HEIGHT);

    _relative.local.layoutTo(this.mMultip, 0.5, 0, this, 0.5, 0.5);
    _relative.layoutTo(this.mBet, 0.5, 0, this.mMultip, 0.5, 1, 0, 2);
    _relative.layoutTo(this.mCounts, 0, 0, this.mBet, 0, 1, 0, 2);

    _relative.layoutTo(this.mControl, 0.5, 1, this.mMultip, 0.5, 0, 0, -20);
};
BetPanel.prototype.update = function () {
    this.mCounts.setCoins(_model.getTotal(), _model.getCurrent());
};

module.exports = BetPanel;