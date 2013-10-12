var _Container = require('component/container.js');
var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _TouchNode = require('component/touchnode.js').TouchNode;
var _LinkedList = require('core/linkedlist_1.js');
var _inherit = require('core/inherit.js');
var _listRemove = _LinkedList.prototype.remove;
var _listAdd = _LinkedList.prototype.add;
var _config = require('scenes/game/gamedata.js').gamedata;

var _animas = require('scenes/game/animas.js');
var _FallAnima = _animas.FallAnima;
var _RemoveAnima = _animas.RemoveAnima;
var _CompactAnima = _animas.CompactAnima;
var _ClearAnima = _animas.ClearAnima;

var COLORS = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 1]
];

var STATUS_WAITING = 1;// waiting user set bet
var STATUS_FALL = 2;// start new game
var STATUS_REMOVE = 3;// one or more cell groups found, and running the removing anima
var STATUS_COMPACT = 4;// start new game
var STATUS_CLEAR = 5;// none cell can be removed, ending current game

// ==========================
// TouchDelegate
// ==========================
function TouchDelegate(game) {
    this.game = game;
    this.mDisable = true;
    this.init();
}
TouchDelegate.prototype.init = function () {
    this.width = this.game.width();
    this.height = this.game.height();
}
TouchDelegate.prototype.isInArea = function (x, y) {
    if (x < 0 || y < 0) {
        return false;
    }
    if (x > this.width || y > this.height) {
        return false;
    }
    return true;
}
TouchDelegate.prototype.disable = function (event) {
    this.mDisable = true;
}
TouchDelegate.prototype.enable = function (event) {
    this.mDisable = false;
}
TouchDelegate.prototype.onTouch = function (event) {
    if (this.mDisable) {
        return false;
    }
    var x = event.vector[0];
    var y = event.vector[1];
    if (!this.isInArea(x, y)) {
        return false;
    }
    if (event.state == 0) {
        this.game.onTouch(x, y);
    }
    return true;
}

// ==========================
// Cell
// ==========================
function Cell(unit) {
    _Container.call(this);

    this.previous = this.next = null;
    this.mList = null;
    this.data = 0;

    this.hidden = false;
    this.cellx = this.celly = 0;

    this.setSize(unit, unit);
    this.rect = _global.colorNode(COLORS[0], unit, unit);
    this.mSelected = _global.colorNode(COLORS[3], unit - 20, unit - 20);
    this.mSelected.setAnthor(0.5, 0.5);
    this.mSelected.setPosition(unit / 2, unit / 2);
    this.addChild(this.rect);
    this.addChild(this.mSelected);

    this.flur();
}
_inherit(Cell, _Container);
Cell.prototype.setCoordinate = function (x, y) {
    this.cellx = x;
    this.celly = y;
}
Cell.prototype.setData = function (data) {
    this.data = data;
    this.rect.setColor(COLORS[data]);
    this.mSelected.setColor(COLORS[(data + 3) % 4 ]);
}
Cell.prototype.click = function () {
    this.setData((this.data + 1) % 4);
}
Cell.prototype.focus = function () {
    this.mSelected.visiable(true);
}
Cell.prototype.flur = function () {
    this.mSelected.visiable(false);
}
Cell.prototype.toString = function () {
    return 'cell';
}

// ==========================
// Cell Group
// ==========================
function Group(gamearea) {
    _LinkedList.call(this);

    this.mList = null;
    this.mArea = gamearea;
}
_inherit(Group, _LinkedList);
// if empty, remove from parent
Group.prototype.remove = function (cell) {
    _listRemove.call(this, cell);
    if (this.count() == 0) {
        this.mList.remove(this);
    }
}
//Group.prototype.add = function (cell) {
//    _listAdd.call(this, cell);
//    if (this.count() >= this.mArea.mMinMatch) {
//        this.mArea.setCheckRemove();
//    }
//}
Group.prototype.onMerge = function (cell) {
    this.mList.remove(this);
}
Group.prototype.draw = function (context) {
    var start = this.anthor;
    while ((start = start.next) != this.anthor) {
        start.draw(context);
    }
}

function flatCell(c) {
    return '[' + c.cellx + ',' + c.celly + ',' + c.data + ']';
}
function flat(group) {
    var data = [];
    var itor = group.iterator();
    while (itor.hasNext()) {
        var c = itor.next();
        data.push(flatCell(c));
    }
    return data.join();
}

// ==========================
// GameArea
// ==========================
var EDGE = 48;
function GameArea(game) {
    _UIContainer.call(this);
    this.mFlags |= this.FlagSeal;

    var config = _config.getGameConf();
    this.mGame = game;
    this.mConfig = config;
    this.mCols = config.col;
    this.mRows = config.row;
    this.mMinMatch = config.minmatch;
    this.mUnit = config.unitwidth;
    this.setSize(this.mUnit * this.mCols, this.mUnit * this.mRows);
    this.mMaxCells = this.mCols * this.mRows;

    this.mEmpty = new _LinkedList();
    this.mGroups = new _LinkedList();
    this.mRemove = new _LinkedList();// success cell groups

    this.mCells = new Array(this.mMaxCells);
    for (var i = 0, l = this.mCols * this.mRows; i < l; i++) {
        this.createCell(i);
    }

    this.mState = STATUS_WAITING;
    this.mFallAnima = new _FallAnima();
    this.mRemoveAnima = new _RemoveAnima();
    this.mCompactAnima = new _CompactAnima();
    this.mClearAnima = new _ClearAnima();

    this.linkEmpty();
    this.updateDrawable();
    this.mTouchDelegate.init();
    this.mTouchDelegate.enable();
}
_inherit(GameArea, _UIContainer);
GameArea.prototype.createCell = function (index) {
    var yindex = index % this.mRows;
    var xindex = (index - yindex) / this.mRows;
    var cell = new Cell(EDGE);
    cell.setAnthor(0.5, 0.5);
    cell.setPosition((xindex + 0.5) * this.mUnit, (this.mRows - yindex - 0.5) * this.mUnit);
    cell.setCoordinate(xindex, yindex);
    cell.setData(Math.floor(Math.random() * 4));

    this.mCells[index] = cell;
    this.mEmpty.add(cell);
}
GameArea.prototype.createEventNode = function () {
    return new _TouchNode(this, this.mTouchDelegate = new TouchDelegate(this));
}
GameArea.prototype.onTouch = function (x, y) {
    var xindex = Math.floor(x / this.mUnit);
    var yindex = this.mRows - Math.floor(y / this.mUnit) - 1;
    this.updateCell(xindex, yindex);
}
GameArea.prototype.updateCell = function (x, y) {
    var index = x * this.mRows + y;
    var cell = this.mCells[index];
    cell.click();

    this.mEmpty.merge(cell.mList);
    this.linkEmpty();
    this.updateDrawable();
}
GameArea.prototype.toString = function () {
    return 'area';
}
/**
 * @param cell a cell nearby
 * @param current cell
 */
GameArea.prototype.linkNear = function (cell, current) {
    var empty = this.mEmpty;
    if (cell.data == current.data && cell.mList !== empty) {
        if (current.mList === empty) {
            cell.mList.add(current);
        } else {
            cell.mList.merge(current.mList);
        }
    }
}
GameArea.prototype.link = function (cell) {
    var x = cell.cellx;
    var y = cell.celly;
    var index = x * this.mRows + y;
    if (x > 0) {
        this.linkNear(this.mCells[index - this.mRows], cell);
    }
    if (x < this.mCols - 1) {
        this.linkNear(this.mCells[index + this.mRows], cell);
    }
    if (y > 0) {
        this.linkNear(this.mCells[index - 1], cell);
    }
    if (y < this.mRows - 1) {
        this.linkNear(this.mCells[index + 1], cell);
    }
    // if cell belong to none group, create a group and add cell to it
    if (cell.mList === this.mEmpty) {
        this.mGroups.add(this.createGroup(cell));
    }
}
/**
 * TODO use pool in future
 * @param cell
 * @returns {Group}
 */
GameArea.prototype.createGroup = function (cell) {
    var g = new Group(this);
    g.add(cell);
    return g;
}
/**
 * for test purpose
 */
GameArea.prototype.updateDrawable = function () {
    var itor = this.mEmpty.iterator();
    while (itor.hasNext()) {
        itor.next().flur();
    }

    var gItor = this.mGroups.iterator();
    while (gItor.hasNext()) {
        var group = gItor.next();

        // if match count < min match, ignore
        if (group.count() < this.mMinMatch) {
            itor = group.iterator();
            while (itor.hasNext()) {
                itor.next().flur();
            }
        } else {
            itor = group.iterator();
            while (itor.hasNext()) {
                itor.next().focus();
            }
        }
    }
}
/**
 * try to add cells to groups near by
 */
GameArea.prototype.linkEmpty = function () {
    var empty = this.mEmpty;
    while (empty.count() > 0) {
        this.link(empty.last());
    }
}
/**
 * user set the bet coins and start next game
 * @param state
 */
GameArea.prototype.startNextRound = function () {
    if (this.mState == STATUS_WAITING) {
        console.log('STATUS_WAITING');
        this.startRemoveOrClear();
    }
}
/**
 * remove match cells
 */
GameArea.prototype.startRemoveAnima = function () {
    this.mRemoveAnima.reset(this.mRemove);
    this.mState = STATUS_REMOVE;
}
/**
 * compact cells left
 */
GameArea.prototype.startCompatAnima = function () {
    this.mState = STATUS_COMPACT;
}
/**
 * add new cells
 */
GameArea.prototype.startFallAnima = function () {
    this.mState = STATUS_FALL;
}
/**
 * no cell match
 */
GameArea.prototype.startClearAnima = function () {
    this.mState = STATUS_CLEAR;
}
/**
 * called when cells are full
 */
GameArea.prototype.startRemoveOrClear = function () {
    this.linkEmpty();

    var result = this.mRemove;
    var itor = this.mGroups.iterator();
    while (itor.hasNext()) {
        var g = itor.next();
        if (g.count() >= this.mMinMatch) {
            itor.remove();
            result.add(g);
        }
    }

//    // if find any match cells
//    if (result.count() > 0) {
//        console.log('-->01');
//        this.startRemoveAnima();
//    } else {
//        console.log('-->02');
//        this.startClearAnima();
//    }
}
GameArea.prototype.drawContent = function (context) {
    var gItor = this.mGroups.iterator();
    while (gItor.hasNext()) {
        gItor.next().draw(context);
    }
}
GameArea.prototype.update = function (step) {
    switch (this.mState) {
        case STATUS_WAITING:
            break;

        case STATUS_FALL:// -> drop or clear
            if (this.mFallAnima.update(step)) {
                console.log('STATUS_FALL');
                this.startRemoveOrClear();
            }
            break;

        case STATUS_REMOVE:// -> compact
            if (this.mRemoveAnima.update(step)) {
                this.startCompatAnima(this.mRemoveAnima.timeleft());
            }
            break;

        case STATUS_COMPACT:// -> fall
            if (this.mCompactAnima.update(step)) {
                this.startFallAnima();
            }
            break;

        case STATUS_CLEAR:// -> waiting
            if (this.mClearAnima.update(step)) {
                this.mState = STATUS_WAITING;
            }
            break;
    }
}

module.exports = GameArea;