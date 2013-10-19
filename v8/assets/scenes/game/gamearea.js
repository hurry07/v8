var _Container = require('component/container.js');
var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _TouchNode = require('component/touchnode.js').TouchNode;
var _LinkedList = require('core/linkedlist_1.js');
var _inherit = require('core/inherit.js');
var _config = require('scenes/game/gamedata.js').gamedata;
var _levelconf = require('scenes/game/gamedata.js').levelconf;

var _animas = require('scenes/game/animas.js');
var _FallAnima = _animas.FallAnima;
var _RemoveAnima = _animas.RemoveAnima;
var _CompactAnima = _animas.CompactAnima;
var _ClearAnima = _animas.ClearAnima;

var COLORS = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 0, 1, 1] ,
    [0, 0, 0, 1]
];
var COLORS_ALPHA = [
    [1, 0, 0, 0.2],
    [0, 1, 0, 0.2],
    [0, 0, 1, 0.2],
    [1, 0, 1, 0.2],
    [0, 0, 0, 0.2]
];

var STATUS_WAITING = 1;// waiting user set bet
var STATUS_FALL = 2;// start new game
var STATUS_REMOVE = 3;// one or more cell groups found, and running the removing anima
var STATUS_COMPACT = 4;// start new game
var STATUS_CLEAR = 5;// none cell can be removed, ending current game

var STATUS_REMOVE_HOLD = 6;
var STATUS_COMPACT_HOLD = 7;
var STATUS_COMPACT_BEFORE = 8;

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
};
TouchDelegate.prototype.isInArea = function (x, y) {
    if (x < 0 || y < 0) {
        return false;
    }
    if (x > this.width || y > this.height) {
        return false;
    }
    return true;
};
TouchDelegate.prototype.disable = function (event) {
    this.mDisable = true;
};
TouchDelegate.prototype.enable = function (event) {
    this.mDisable = false;
};
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
};

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
};
Cell.prototype.setData = function (data) {
    this.data = data;
    this.rect.setColor(COLORS[data]);
    this.mSelected.setColor(COLORS[(data + 4) % 5]);
};
Cell.prototype.click = function () {
    this.setData((this.data + 1) % 5);
};
Cell.prototype.focus = function () {
    this.mSelected.setColor(COLORS[(this.data + 4) % 5]);
    this.mSelected.visiable(true);
};
Cell.prototype.flur = function () {
    this.mSelected.setColor(COLORS_ALPHA[(this.data + 4) % 5]);
    this.mSelected.visiable(true);
};
Cell.prototype.toString = function () {
    return this.cellx + ',' + this.celly + ',' + this.data;
};

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
};
Group.prototype.flur = function () {
    var cursor = this.anchor.next;
    while (cursor !== this.anchor) {
        cursor.flur();
        cursor = cursor.next;
    }
};
Group.prototype.focus = function () {
    var cursor = this.anchor.next;
    while (cursor !== this.anchor) {
        cursor.focus();
        cursor = cursor.next;
    }
};

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

function CellList(size) {
    this.cells = new Array(size);
    this.capacity = 0;
}
CellList.prototype.reset = function (group) {
    var size = 0;
    var itor = group.iterator();
    while (itor.hasNext()) {
        this.cells[size++] = itor.next();
    }
    this.capacity = size;
};

// ==========================
// GameArea
// ==========================
var EDGE = 48;
function GameArea(game) {
	var _timer = require('core/timer.js');
	var tick = new _timer.TickTack();
    _UIContainer.call(this);
    tick.check('initSupre');
    this.mFlags |= this.FlagSeal;

    var config = _config.getGameConf();
    this.mGame = game;
    this.mConfig = config;
    this.mCols = config.col;
    this.mRows = config.row;
    this.mUnit = config.unitwidth;
    this.setSize(this.mUnit * this.mCols, this.mUnit * this.mRows);
    this.mMaxCells = this.mCols * this.mRows;

    tick.check();
    this.mDirty = new CellList(this.mMaxCells);
    tick.check();
    this.mEmpty = new Group(this);
    this.mPool = new Group(this);
    tick.check();
    this.mGroups = new _LinkedList();// matches cells
    this.mRemove = new _LinkedList();// success cell groups

    // cell0 located in left top
    this.mCells = new Array(this.mMaxCells);
    for (var i = 0, l = this.mMaxCells; i < l; i++) {
        this.createCell(i);
    }
    tick.check('createCells');
    this.mHeaders = new Array(this.mCols);
    this.mTop = [];// empty cell cout
    for (var i = 0, l = this.mCols; i < l; i++) {
        this.mHeaders.push(new Header(i));
        this.mTop.push(this.mRows);
    }

    tick.check();
    this.mState = STATUS_WAITING;
    this.mFallAnima = new _FallAnima();
    this.mRemoveAnima = new _RemoveAnima(this.mGame);
    this.mCompactAnima = new _CompactAnima();
    this.mClearAnima = new _ClearAnima();

    tick.check();
    this.linkEmpty();
    tick.check('linkEmpty');
    this.updateDrawable();
    tick.check('updateDrawable');
    this.mTouchDelegate.init();
    this.mTouchDelegate.enable();
    tick.check();
}
_inherit(GameArea, _UIContainer);
GameArea.prototype.createCell = function (index) {
    var cell = new Cell(EDGE);
    cell.setAnchor(0.5, 0.5);
    cell.visiable(false);
    this.putCell(cell, index);
    this.mCells[index] = cell;
    return cell;
};
GameArea.prototype.createEventNode = function () {
    return new _TouchNode(this, this.mTouchDelegate = new TouchDelegate(this));
};
GameArea.prototype.onTouch = function (x, y) {
    var xindex = Math.floor(x / this.mUnit);
    var yindex = this.mRows - Math.floor(y / this.mUnit) - 1;
    this.updateCell(xindex, yindex);
};
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
    this.mGroups.remove(group);
    this.mEmpty.merge(group);
    this.releaseGroup(group);

    console.log('updateCell:', this.mEmpty.count());
    this.linkEmpty();
    this.updateDrawable();
};
//GameArea.prototype.updateAll = function () {
//    this.mergeGroups(this.mEmpty, this.mGroups);
//    this.mergeGroups(this.mEmpty, this.mRemove);
//    this.mEmpty.clear();
//    var data = '5,5,1|5,4,3|5,3,3|5,2,1|5,1,0|4,4,3|4,3,0|4,2,2|3,6,3|3,5,0|3,4,2|3,3,2|2,6,2|2,5,0|2,4,2|2,3,2|1,6,1|1,5,1|1,4,1|1,3,3|1,2,0|1,1,1|0,6,1|0,5,2|0,4,2|0,3,1|0,2,0|4,5,3|5,6,2|4,6,0|3,2,3|2,2,2|4,1,1|3,1,1|3,0,3|5,0,2|4,0,3|0,1,3|1,0,2|0,0,2|2,1,2|2,0,1'.split('|');
//    console.log(data.length);
//    for (var i = 0; i < data.length; i++) {
//        var cell = data [i].split(',');
//        var x = cell[0] - '0';
//        var y = cell[1] - '0';
//        var c = this.mCells[x * this.mRows + y];
//        this.mEmpty.add(c);
//        c.setData(cell[2] - '0');
//    }
//    console.log('updateAll', 'mEmpty:' + this.mEmpty.count(), this.totalCount(this.mGroups), this.totalCount(this.mRemove));
//    console.log(this.mEmpty);
//    this.linkEmpty();
//    this.updateDrawable();
//    var itor = this.mGroups.iterator();
//    while (itor.hasNext()) {
//        var g = itor.next();
//        if (g.count() >= this.mMinMatch) {
//            this.printGroup(g);
//        }
//    }
//}
GameArea.prototype.updateAll = function () {
    for (var i = 0, l = this.mMaxCells; i < l; i++) {
        _levelconf.initCell(this.mCells[i]);
    }
    console.log('updateAll', 'groups:' + this.totalCount(this.mGroups), 'remove:' + this.totalCount(this.mRemove));
    this.mergeGroups(this.mEmpty, this.mGroups);
    this.mergeGroups(this.mEmpty, this.mRemove);
    console.log('updateAll', 'mEmpty:' + this.mEmpty.count());
    console.log(this.mEmpty);
    this.linkEmpty();
    this.updateDrawable();
    var itor = this.mGroups.iterator();
    while (itor.hasNext()) {
        var g = itor.next();
        if (g.count() >= _levelconf.getMinMatch()) {
            this.printGroup(g);
        }
    }
};
GameArea.prototype.toString = function () {
    return 'area';
};
/**
 * @param cell a cell nearby
 * @param current cell
 */
GameArea.prototype.linkNear = function (cell, current) {
    var g = cell.mList;
    if (cell.data == current.data && g !== current.mList) {
        if (g === this.mEmpty) {
            current.mList.add(cell);
        } else {
            current.mList.merge(g);
            this.mGroups.remove(g);
            this.releaseGroup(g);
        }
    }
};
GameArea.prototype.link = function (cell) {
    // make sure current cell belongs to a group
    if (cell.mList === this.mEmpty) {
        this.mGroups.add(this.createGroup(cell));
    }
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
};
GameArea.prototype.putCell = function (cell, index) {
    var yindex = index % this.mRows;
    var xindex = (index - yindex) / this.mRows;
    cell.setPosition((xindex + 0.5) * this.mUnit, (this.mRows - yindex - 0.5) * this.mUnit);
    cell.setCoordinate(xindex, yindex);
};
/**
 * TODO use pool in future
 * @param cell
 * @returns {Group}
 */
GameArea.prototype.createGroup = function (cell) {
    var g = new Group(this);
    g.add(cell);
    return g;
};
GameArea.prototype.releaseGroup = function (group) {
};
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
        if (group.count() < _levelconf.getMinMatch()) {
            group.flur();
        } else {
            group.focus();
        }
    }
};
/**
 * try to add cells to groups near by
 */
GameArea.prototype.linkEmpty = function () {
    this.mDirty.reset(this.mEmpty);
    for (var i = 0, cells = this.mDirty.cells, l = this.mDirty.capacity; i < l; i++) {
        this.link(cells[i]);
    }
};
/**
 * user set the bet coins and start next game
 */
GameArea.prototype.startNextRound = function () {
    console.log('startNextRound', this.mState);
    if (this.mState == STATUS_WAITING) {
        this.startFallAnima();
//    } else if (this.mState == STATUS_REMOVE_HOLD) {
//        this.mState = STATUS_REMOVE;
//    } else if (this.mState == STATUS_COMPACT_HOLD) {
//        this.mState = STATUS_COMPACT_BEFORE;
    }
};
GameArea.prototype.goonGame = function () {
    if (this.mState == STATUS_REMOVE_HOLD) {
        this.mState = STATUS_REMOVE;
    } else if (this.mState == STATUS_COMPACT_HOLD) {
        this.mState = STATUS_COMPACT_BEFORE;
    }
}
/**
 * compact cells left
 */
GameArea.prototype.startCompatAnima = function () {
    var empty = this.mEmpty;
    var pool = this.mPool;
    for (var colend = this.mMaxCells - 1, colindex = this.mCols - 1, cells = this.mCells; colend > -1; colend -= this.mRows, colindex--) {

        var lastcell = colend;
        for (var r = colend, colstart = r - this.mRows; r > colstart; r--) {
            var cell = cells[r];
            if (cell.mList === pool) {
                continue;
            }

            if (lastcell != r) {
                var cellgroup = cell.mList;
                if (cellgroup !== empty) {
                    empty.merge(cellgroup);
                    this.mGroups.remove(cellgroup);
                    this.releaseGroup(cellgroup);
                }
                this.putCell(cell, lastcell);// update cell position
                cells[lastcell] = cell;
            }
            lastcell--;
        }
        this.mTop[colindex] = this.mRows - (colend - lastcell);
        console.log('<<', colindex, colend, lastcell, this.mTop[colindex]);
    }

    console.log('compact mTop:', this.mTop);
    console.log('empty:' + this.mEmpty.count(), 'match:' + this.totalCount(this.mGroups));
    this.mCompactAnima.reset(1);
    this.mState = STATUS_COMPACT;
};
/**
 * add new cells
 */
GameArea.prototype.startFallAnima = function () {
    var group;
    var cell;
    var start;
    var result = this.mRemove;
    for (var i = 0, cols = this.mCols; i < cols; i++) {
        var count = this.mTop[i];
        if (count == 0) {
            continue;
        }

        start = i * this.mRows;
        result.add(group = new Group(this));
        for (var c = 0; c < count; c++) {
            group.add(cell = this.createCell(start++));
            _levelconf.initCell(cell);
        }
    }

    this.mFallAnima.reset(result);
    this.mPool.clear();
    this.mState = STATUS_FALL;
};
/**
 * called when cells are full
 */
GameArea.prototype.startRemoveOrClear = function () {
    this.linkEmpty();
    this.updateDrawable();

    // remove match groups
    var minmatch = _levelconf.getMinMatch();
    var result = this.mRemove;
    var itor = this.mGroups.iterator();
    while (itor.hasNext()) {
        var g = itor.next();
        if (g.count() >= minmatch) {
            itor.remove();
            result.add(g);
            this.printGroup(g);
        }
    }

    // if find any match cells
    if (result.count() > 0) {
        this.mRemoveAnima.reset(result);
        console.log('-->STATUS_REMOVE_HOLD');
//        this.mState = STATUS_REMOVE_HOLD;
        this.mState = STATUS_REMOVE;
    } else {
        this.mergeGroups(this.mPool, this.mGroups);
        this.mPool.merge(this.mEmpty);
        this.mPool.clear();
        for (var i = 0, l = this.mCols; i < l; i++) {
            this.mTop[i] = this.mRows;
        }
        console.log('clear', this.mEmpty.count(), this.totalCount(this.mGroups), this.totalCount(this.mRemove));
        this.mState = STATUS_WAITING;
    }
};
GameArea.prototype.drawContent = function (context) {
    for (var i = 0, arr = this.mCells, l = this.mMaxCells; i < l; i++) {
        arr[i].draw(context);
    }
};
GameArea.prototype.mergeGroups = function (target, groups) {
    var itor = groups.iterator();
    var g;
    while (itor.hasNext()) {
        g = itor.next();
        itor.remove(g);
        target.merge(g);
        this.releaseGroup(g);
    }
};
GameArea.prototype.totalCount = function (groups) {
    var count = 0;
    var itor = groups.iterator();
    while (itor.hasNext()) {
        count += itor.next().count();
    }
    return count;
};
GameArea.prototype.printGroup = function (group) {
    var row = [];
    var cells = [];
    for (var i = 0; i < this.mCols; i++) {
        row.push('. ');
    }
    row.push('\n');
    for (var i = 0; i < this.mRows; i++) {
        cells = cells.concat(row.slice(0));
    }

    var itor = group.iterator();
    while (itor.hasNext()) {
        var cell = itor.next();
        cells[cell.cellx + cell.celly * (this.mCols + 1)] = cell.data + ' ';
    }
    console.log(cells.join(''));
};
GameArea.prototype.update = function (step) {
    switch (this.mState) {
        case STATUS_FALL:// -> drop or clear
            if (this.mFallAnima.update(step)) {
                this.mergeGroups(this.mEmpty, this.mRemove);
                console.log('after STATUS_FALL:', this.mEmpty.count());
                this.startRemoveOrClear();
            }
            break;

        case STATUS_REMOVE:// -> compact
            if (this.mRemoveAnima.update(step)) {
//                this.mState = STATUS_COMPACT_HOLD;
                this.mergeGroups(this.mPool, this.mRemove);
                this.startCompatAnima();
            }
            break;

        case STATUS_COMPACT_BEFORE:
            this.mergeGroups(this.mPool, this.mRemove);
            this.startCompatAnima();
            break;

        case STATUS_COMPACT:// -> fall
            if (this.mCompactAnima.update(step)) {
                //this.mState = STATUS_WAITING;
                this.startFallAnima();
            }
            break;

        case STATUS_CLEAR:// -> waiting
//            if (this.mClearAnima.update(step)) {
//                this.mState = STATUS_WAITING;
//            }
            break;
    }
};

module.exports = GameArea;