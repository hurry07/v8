var _global = require('framework/global.js');
var _scene = require('component/scene.js');
var _button = require('widget/button.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;
var _absoult = _layout.absolute;
var R = require('framework/r.js');
var _Container = require('component/container.js');
var _inherit = require('core/inherit.js');
var _DB = require('framework/database.js');

function n9patchBt(id, id1, id2, left, right, width, sprite) {
    var p1 = _global.sprite(id1).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    var p2 = _global.sprite(id2).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    var bt = _button.createButtonWithId(id, p1, p2);
    if (sprite) {
        var sp = _global.spriteNode(sprite);
        _relative.layout(sp, [0.5, 0.5], _relative.localPoint(bt, 0.5, 0.5));
        bt.addChild(sp);
    }
    return bt;
}
function titleButton(id, label) {
    return n9patchBt(id, R.upgrade.b_shop_01, R.upgrade.b_shop_02, 40, 30, 150, label);
}
function closeButton(id) {
    var p1 = _global.spriteNode(R.upgrade.b_close_01);
    var p2 = _global.spriteNode(R.upgrade.b_close_02);
    var bt = _button.createButtonWithId(id, p1, p2);

    var sp = _global.spriteNode(R.upgrade.b_close);
    _relative.layout(sp, [0.5, 0.5], _relative.localPoint(bt, 0.5, 0.5));
    bt.addChild(sp);

    return bt;
}
function chargeButton(id) {
    var p1 = _global.spriteNode(R.upgrade.b_addcoins);
    return _button.createButtonWithId(id, p1);
}

function Icon() {
    _Container.call(this);

    this.addChild(this.mBg = _global.spriteNode(R.upgrade.paper_01));
    this.setSize(this.mBg.getSize());
}
_inherit(Icon, _Container);

/**
 * tool list panel
 * @constructor
 */
function ToolsLeft() {
    _Container.call(this);

    this.addChild(this.mBg = _global.spriteNode(R.upgrade.paper_01));
    this.setSize(this.mBg.getSize());
}
_inherit(ToolsLeft, _Container);

/**
 * tool list panel
 * @constructor
 */
function ToolsPanel() {
    _Container.call(this);

    this.addChild(this.mBg = _global.spriteNode(R.upgrade.paper_01));
    this.setSize(this.mBg.getSize());
    this.addChild(this.split = _global.spriteNode(R.upgrade.split_v));

    this.layout();
}
_inherit(ToolsPanel, _Container);
ToolsPanel.prototype.layout = function () {
    _relative.layoutTo(this.split, .5, .5, this.mBg, 0, 0.5, 140, 0);
}

// ========================================================
// CoinsSlot
// ========================================================
function CoinsSlot() {
    _Container.call(this);

    var bg = _global.spriteNode(R.upgrade.bg_upgrade_coins);
    this.addChild(bg);
    this.addChild(this.icon = _global.spriteNode(R.upgrade.p_coin));
    this.setSize(bg.getSize());

    this.layout();
}
_inherit(CoinsSlot, _Container);
CoinsSlot.prototype.layout = function () {
    var halfh = this.height() / 2;
    _relative.layout(this.icon, [.5, .5], _absoult.localPoint(this, halfh, halfh - 1));
}

// ========================================================
// CoinsStarSlot
// ========================================================
function CoinsStarSlot() {
    _Container.call(this);

    var bg = _global.spriteNode(R.upgrade.bg_coins_star);
    this.setSize(bg.getSize());

    this.addChild(bg);
    this.addChild(this.icon = _global.spriteNode(R.upgrade.p_coin));
    this.addChild(this.star = _global.spriteNode(R.upgrade.p_star));
    this.addChild(this.button = chargeButton('bt_charge'));

    this.layout();
}
_inherit(CoinsStarSlot, _Container);
CoinsStarSlot.prototype.layout = function () {
    var halfh = this.height() / 2;
    _relative.layout(this.icon, [.5, .5], _absoult.localPoint(this, halfh, halfh - 1));
    _relative.layout(this.star, [.5, .5], _absoult.localPoint(this, this.width() / 2, halfh - 1));
    _relative.layout(this.button, [.5, .5], _absoult.localPoint(this, this.width() - halfh, halfh));
}

function createCoinSlot(slotClass, bgId, w) {
    var bg = _global.sprite(bgId).$9patch_h().left(20).right(20).setSize(w, 0).updateMesh();
    return new slotClass(bg, w);
}

/**
 * description of a tool
 * @constructor
 */
function UpgradePanel() {
    _Container.call(this);
    this.setSize(250, 388);

    this.addChild(this.title = _global.spriteNode(R.upgrade.z_turbo));

    this.addChild(this.mBg = _global.spriteNode(R.upgrade.bg_upgrade));
    this.addChild(this.upgrade = titleButton('bt_upgrade', R.upgrade.b_z_upgrade));
    this.addChild(this.coins = new CoinsSlot());

    this.layout();
}
_inherit(UpgradePanel, _Container);
UpgradePanel.prototype.layout = function () {
    _relative.layoutTo(this.mBg, 0.5, 1, this, 0.5, 1, 0, -53);
    _relative.layoutTo(this.title, 0.5, 0, this.mBg, 0.5, 1);

    _relative.layoutTo(this.upgrade, 0.5, 0, this, 0.5, 0, 0, 11);
    _relative.layoutTo(this.coins, 0.5, 0, this.upgrade, 0.5, 1, 0, 11);
}

console.log(_DB.getData('toolsConf'));

module.exports = _scene.createScene(
    function (w, h) {
        this.setSize(w, h);
        this.addChild(this.mBg = _global.sprite(R.upgrade.bg).$9patch_h().left(30).right(30).setSize(w, h).updateMesh());

        var buttons = this.buttons = {};
        this.addChild(buttons.avator = titleButton('bt_avator', R.upgrade.b_z_avatar));
        this.addChild(buttons.skill = titleButton('bt_skill', R.upgrade.b_z_skill));
        this.addChild(buttons.achive = titleButton('bt_achive', R.upgrade.b_z_achievement));
        this.addChild(this.coinStar = new CoinsStarSlot('slot_coinstart'));
        this.addChild(buttons.close = closeButton('bt_close'));

        this.addChild(this.toolsPanel = new ToolsPanel());
        this.addChild(this.desPanel = new UpgradePanel());

        this.mRotate = 0;
        this.layout();

        this.__touchnode__.print();
    }, {
        update: function (context) {
        },
        onSizeChange: function (w, h) {
            this.setSize(w, h);
            this.mBg.setSize(w, h).updateMesh();
            _relative.layoutTo(this.buttons.close, 1, 0.5, this, 1, 1, -6, -42);
        },
        layout: function () {
            this.mBg.setSize(this.width(), this.height()).updateMesh();
            _relative.layoutTo(this.mBg, 0, 0, this, 0, 0);

            var b = this.buttons;
            _relative.layoutTo(b.avator, 0, 0.5, this, 0, 1, 6, -42);
            _relative.layoutTo(b.skill, 0, 0.5, b.avator, 1, 0.5);
            _relative.layoutTo(b.achive, 0, 0.5, b.skill, 1, 0.5);
            _relative.layoutTo(b.close, 1, 0.5, this, 1, 1, -6, -42);
            _relative.layoutTo(this.coinStar, 0, 0, b.achive, 1, 0, 7, 4);

            _absoult.layout(this.toolsPanel, 0, 0, 13, 13);

            var cencer = _relative.worldPoint(this.toolsPanel, 1, 0);
            cencer[0] += (this.width() - cencer[0] - 20) / 2;
            _relative.layout(this.desPanel, [0.5, 0], cencer);
        }
    });
