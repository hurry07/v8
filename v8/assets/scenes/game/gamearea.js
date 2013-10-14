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
var COLORS_ALPHA = [
    [1, 0, 0, 0.2],
    [0, 1, 0, 0.2],
    [0, 0, 1, 0.2],
    [0, 0, 0, 0.2]
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
    this.mSelected.setAnchor(0.5, 0.5);
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
    this.mSelected.setColor(COLORS[(data + 3) % 4]);
}
Cell.prototype.click = function () {
    this.setData((this.data + 1) % 4);
}
Cell.prototype.focus = function () {
    this.mSelected.setColor(COLORS[(this.data + 3) % 4]);
    this.mSelected.visiable(true);
}
Cell.prototype.flur = function () {
    this.mSelected.setColor(COLORS_ALPHA[(this.data + 3) % 4]);
    this.mSelected.visiable(true);
}
Cell.prototype.toString = function () {
    return this.cellx + ',' + this.celly;
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
Group.prototype.toString = function () {
    var children = [];
    var cursor = this.anchor.next;
    while (cursor !== this.anchor) {
        children.push(cursor);
        cursor = cursor.next;
    }
    return 'Group count:' + this.count() + ', [' + children.join('|') + ']';
}
Group.prototype.flur = function () {
    var cursor = this.anchor.next;
    while (cursor !== this.anchor) {
        cursor.flur();
        cursor = cursor.next;
    }
}
Group.prototype.focus = function () {
    var cursor = this.anchor.next;
    while (cursor !== this.anchor) {
        cursor.focus();
        cursor = cursor.next;
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

function Header(index) {
    this.index = 0;
    this.mCells = [];
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

    this.mEmpty = new _LinkedList();
    this.mGroups = new _LinkedList();
    this.mRemove = new _LinkedList();// success cell groups

    // cell0 located in left top
    this.mMaxCells = this.mCols * this.mRows;
    this.mCells = new Array(this.mMaxCells);
    for (var i = 0, l = this.mCols * this.mRows; i < l; i++) {
        this.createCell(i);
    }
    this.mHeaders = new Array(this.mCols);
    this.mTop = [];// empty cell cout
    for (var i = 0, l = this.mCols; i < l; i++) {
        this.mHeaders.push(new Header(i));
        this.mTop.push(0);
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
    var cell = new Cell(EDGE);
    cell.setAnchor(0.5, 0.5);
    cell.visiable(false);
    this.putCell(cell, index);
    this.mCells[index] = cell;
}
GameArea.prototype.createEventNode = function () {
    return new _TouchNode(this, this.mTouchDelegate = new TouchDelegate(this));
}
GameArea.prototype.onTouch = function (x, y) {
    var xindex = Math.floor(x / this.mUnit);
    var yindex = this.mRows - Math.floor(y / this.mUnit) - 1;
    this.updateCell(xindex, yindex);
}
/**
 * the cell has changed
 * @param x
 * @param y
 */
GameArea.prototype.updateCell = function (x, y) {
    var index = x * this.mRows + y;
    var cell = this.mCells[index];
    cell.click();

    var group = cell.mList;
    this.mEmpty.merge(group);
    this.mGroups.remove(group);
    this.releaseGroup(group);

    console.log('updateCell:', this.mEmpty.count());
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
    if (cell.data == current.data) {
        var g = cell.mList;
        if (g === this.mEmpty) {
            current.mList.add(cell);
        } else {
            current.mList.merge(g);
            this.mGroups.remove(g);
            this.releaseGroup(g);
        }
    }
}
GameArea.prototype.link = function (cell) {
    // make sure current cell belongs to a group
    if (cell.mList === this.mEmpty) {
        this.mGroups.add(this.createGroup(cell));
    }
    var x = cell.cellx;
    var y = cell.celly;

    console.log('link:', x, y);
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
}
GameArea.prototype.putCell = function (cell, index) {
    var yindex = index % this.mRows;
    var xindex = (index - yindex) / this.mRows;
    cell.setPosition((xindex + 0.5) * this.mUnit, (this.mRows - yindex - 0.5) * this.mUnit);
    cell.setCoordinate(xindex, yindex);
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
GameArea.prototype.releaseGroup = function (group) {
}
/**
 * for test purpose
 */
GameArea.prototype.updateDrawable = function () {
    var itor = this.mEmpty.iterator();
    while (itor.hasNext()) {
        itor.next().flur();
    }

    var total = 0;
    var gItor = this.mGroups.iterator();
    while (gItor.hasNext()) {
        var group = gItor.next();
        total += group.count();
        console.log('updateDrawable:' + group);

        // if match count < min match, ignore
        if (group.count() < this.mMinMatch) {
            group.flur();
        } else {
            group.focus();
        }
    }
    console.log('total:' + total);
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
        this.startFallAnima();
    }
}
/**
 * compact cells left
 */
GameArea.prototype.startCompatAnima = function () {
    var group = new Group(this);
    console.log('GameArea.prototype.startCompatAnima>>');
    for (var i = this.mMaxCells - 1, col = this.mCols - 1, cells = this.mCells; i > -1; i -= this.mRows, col--) {
        var lastcell = i;
        for (var r = i, end = r - this.mRows; r > end; r--) {
            console.log('==========', r, end);
            var c = cells[r];
            if (c.visiable()) {
                this.putCell(c, lastcell);
                cells[lastcell--] = c;
            } else {
                console.log('04', c.mList, c.mList === this.mEmpty);
                group.add(c);
            }
        }

        if ((this.mTop[col] = group.count()) > 0) {
            this.mRemove.add(group);
            group = new Group(this);
        }
    }

    console.log('GameArea.prototype.startCompatAnima<<');
    this.releaseGroup(group);
    console.log('this.mTop:', this.mTop);
    this.mState = STATUS_COMPACT;
}
/**
 * add new cells
 */
GameArea.prototype.startFallAnima = function () {
    var group;
    var result = this.mRemove;
    for (var i = 0, cells = this.mCells, l = this.mMaxCells; i < l; i++) {
        if (i % this.mRows == 0) {
            result.add(group = new Group(this));
        }
        cells[i].setData(Math.floor(Math.random() * 4));
        group.add(cells[i]);
    }
    this.mFallAnima.reset(result);
    this.mState = STATUS_FALL;
}
/**
 * called when cells are full
 */
GameArea.prototype.startRemoveOrClear = function () {
    this.linkEmpty();
    this.updateDrawable();

//    // remove match groups
//    var result = this.mRemove;
//    var itor = this.mGroups.iterator();
//    while (itor.hasNext()) {
//        var g = itor.next();
//        if (g.count() >= this.mMinMatch) {
//            itor.remove();
//            result.add(g);
//        }
//    }

    // if find any match cells
//    if (result.count() > 0) {
//        this.mRemoveAnima.reset(this.mRemove);
//        this.mState = STATUS_REMOVE;
//        this.mState = STATUS_COMPACT;
//    } else {
//        this.mState = STATUS_CLEAR;
//    }
    this.mState = STATUS_COMPACT;
}
GameArea.prototype.drawContent = function (context) {
    for (var i = 0, arr = this.mCells, l = this.mMaxCells; i < l; i++) {
        arr[i].draw(context);
    }
}
GameArea.prototype.mergeGroups = function (groups) {
    var itor = groups.iterator();
    var g;
    while (itor.hasNext()) {
        g = itor.next();
        itor.remove(g);
        this.mEmpty.merge(g);
        this.releaseGroup(g);
    }
}
GameArea.prototype.update = function (step) {
    switch (this.mState) {
        case STATUS_WAITING:
            break;

        case STATUS_FALL:// -> drop or clear
            if (this.mFallAnima.update(step)) {
                console.log('fall.finish:', this.mEmpty.count(), this.mGroups.count());
                this.mergeGroups(this.mRemove);
                console.log('fall.emptycont:', this.mEmpty.count());
                this.startRemoveOrClear();
//                this.mState = STATUS_COMPACT;
            }
            break;

        case STATUS_REMOVE:// -> compact
            if (this.mRemoveAnima.update(step)) {
                step = this.mRemoveAnima.timeleft();
                this.mergeGroups(this.mRemove);
                this.mState = STATUS_COMPACT;
//                this.startCompatAnima();
            }
            break;

        case STATUS_COMPACT:// -> fall
//            if (this.mCompactAnima.update(step)) {
//                this.startFallAnima();
//            }
            break;

        case STATUS_CLEAR:// -> waiting
//            if (this.mClearAnima.update(step)) {
//                this.mState = STATUS_WAITING;
//            }
            break;
    }
}

module.exports = GameArea;