var _Container = require('component/container.js');
var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _TouchNode = require('component/touchnode.js').TouchNode;
var _LinkedList = require('core/linkedlist_1.js');
var _Node = require('core/linkedlist_1.js').Node;
var _inherit = require('core/inherit.js');

var WIDTH = 350;
var HEIGHT = 350;
var COLORS = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 1]
];
var COLOR_REMOVE = [0, 1, 1, 1];

function Cell(unit) {
    _Container.call(this);
    this.setSize(unit, unit);
    this.data = 0;
    this.node = new _Node(this);
    this.rect = _global.colorNode(COLORS[0], unit, unit);
    this.addChild(this.rect);
}
_inherit(Cell, _Container);
Cell.prototype.click = function () {
    this.data = (this.data + 1) % 4;
    this.rect.setColor(COLORS[this.data]);
    return 'cell';
}
Cell.prototype.toString = function () {
    return 'cell';
}

function GameModle() {
    this.mEmpty = new _LinkedList();
}

function GameArea() {
    _UIContainer.call(this);
    this.mFlags |= this.FlagSeal;
    this.mCols = this.mRows = 7;
    this.mCells = [];

    this.mEmpty = new _LinkedList();
    this.mGroups = [];

    var unit = WIDTH / this.mCols;
    var x = unit / 2;
    var y = HEIGHT - unit / 2;
    var edge = unit - 2;
    for (var xindex = -1; ++xindex < this.mCols;) {
        for (var yindex = -1; ++yindex < this.mRows;) {
            var cell = new Cell(edge);
            cell.setAnthor(0.5, 0.5);
            cell.setPosition(x, y);
            this.mCells.push(cell);
            this.addChild(cell);
            x += unit;
        }
        x = unit / 2;
        y -= unit;
    }
    this.mUnit = unit;
    this.setSize(WIDTH, HEIGHT);
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
        this.mCells[yindex * this.mCols + xindex].click();
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
    if (cell.data == current.data && cell.mList !== this.mEmpty) {
        if (current.mList === empty) {
            cell.mList.add(current);
        } else {
            cell.mList.merge(current.mList);
        }
    }
}
GameArea.prototype.link = function (x, y, index) {
    var c = this.mCells[index];
    if (x > 0) {
        this.linkNear(this.mCells[index - 1], c);
    }
    if (x < this.mCols - 1) {
        this.linkNear(this.mCells[index + 1], c);
    }
    if (y > 0) {
        this.linkNear(this.mCells[index - this.mCols], c);
    }
    if (y < this.mRows - 1) {
        this.linkNear(this.mCells[index + this.mCols], c);
    }
    // 如果当前节点没有连接到任意组, 那么添加当前节点到新的组
    if (c.mList === this.mEmpty) {
        groups[c.id].add(c);
    }
}

GameArea.prototype.update = function () {
}

module.exports = GameArea;