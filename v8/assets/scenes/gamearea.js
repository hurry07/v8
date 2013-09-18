var _Container = require('component/container.js');
var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _TouchNode = require('component/touchnode.js').TouchNode;
var _LinkedList = require('core/linkedlist_1.js');
var _Node = require('core/linkedlist_1.js').Node;
var _inherit = require('core/inherit.js');

var WIDTH = 350;
var HEIGHT = 400;
var COLORS = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 1]
];

function Cell(unit) {
    _Container.call(this);

    this.previous = this.next = null;
    this.mList = null;
    this.data = 0;

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
Cell.prototype.click = function () {
    this.data = (this.data + 1) % 4;
    this.rect.setColor(COLORS[this.data]);
    this.mSelected.setColor(COLORS[(this.data + 3) % 4 ]);
    return 'cell';
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

var _listRemove = _LinkedList.prototype.remove;
function Group() {
    _LinkedList.call(this);
    this.next = this.previous = null;
    this.mList = null;
}
_inherit(Group, _LinkedList);
// if empty, remove from parent
Group.prototype.remove = function (cell) {
    _listRemove.call(this, cell);
    if (this.count() == 0) {
        this.mList.remove(this);
    }
}
Group.prototype.onMerge = function (cell) {
    this.mList.remove(this);
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
function GameArea() {
    _UIContainer.call(this);
    this.mFlags |= this.FlagSeal;

    this.mCols = 7;
    this.mRows = 8;
    this.mCells = [];

    this.mEmpty = new _LinkedList();
    this.mGroups = new _LinkedList();

    var unit = WIDTH / this.mCols;
    var starty = HEIGHT - unit / 2;
    var x = unit / 2;
    var y = starty;
    var edge = unit - 2;

    // column first
    for (var xindex = -1; ++xindex < this.mCols;) {
        for (var yindex = -1; ++yindex < this.mRows;) {
            var cell = new Cell(edge);
            cell.setAnthor(0.5, 0.5);
            cell.setPosition(x, y);
            cell.setCoordinate(xindex, yindex);
            this.mCells.push(cell);
            this.mEmpty.add(cell);
            this.addChild(cell);
            y -= unit;
        }
        x += unit;
        y = starty;
    }
    this.mUnit = unit;
    this.setSize(WIDTH, HEIGHT);

    var group = new Group();
    group.merge(this.mEmpty);
    this.mGroups.add(group);
    this.updateDrawable();
}
_inherit(GameArea, _UIContainer);
GameArea.prototype.createEventNode = function () {
    return new _TouchNode(this);
}
GameArea.prototype.isInArea = function (x, y) {
    if (x < 0 || y < 0) {
        return false;
    }
    if (x > WIDTH || y > HEIGHT) {
        return false;
    }
    return true;
}
GameArea.prototype.onTouch = function (event) {
    var x = event.vector[0];
    var y = event.vector[1];
    if (!this.isInArea(x, y)) {
        return false;
    }
    if (event.state == 0) {
        var xindex = Math.floor(x / this.mUnit);
        var yindex = this.mRows - Math.floor(y / this.mUnit) - 1;
        this.update(xindex, yindex);
    }
    return true;
}
GameArea.prototype.toString = function () {
    return 'area';
}
/**
 * @param cell a cell nearby
 * @param current cell
 */
GameArea.prototype.linkNear = function (cell, current) {
//    console.log('link:', flatCell(cell), flatCell(current));
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
    var g = new Group();
    g.add(cell);
    return g;
}
GameArea.prototype.updateDrawable = function () {
    var itor = this.mEmpty.iterator();
    while (itor.hasNext()) {
        itor.next().flur();
    }

    var gItor = this.mGroups.iterator();
    while (gItor.hasNext()) {
        var group = gItor.next();
        if (group.count() == 1) {
            group.first().flur();
        } else {
            itor = group.iterator();
            while (itor.hasNext()) {
                itor.next().focus();
            }
        }
    }
}
GameArea.prototype.update = function (x, y) {
    var index = x * this.mRows + y;
    var cell = this.mCells[index];

    cell.click();

    var empty = this.mEmpty;
    empty.merge(cell.mList);
    while (empty.count() > 0) {
        this.link(empty.last());
    }

    this.updateDrawable();
}

module.exports = GameArea;