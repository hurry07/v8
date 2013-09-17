var _Container = require('component/container.js');
var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _TouchNode = require('component/touchnode.js').TouchNode;
var _inherit = require('core/inherit.js');

var WIDTH = 350;
var HEIGHT = 350;

function Cell(unit) {
    _Container.call(this);
    this.setSize(unit, unit);

    this.rect = _global.colorNode([1, 1, 0, 1], unit, unit);
    this.addChild(this.rect);
}
_inherit(Cell, _Container);
Cell.prototype.toString = function () {
    return 'cell';
}

function GameArea() {
    _UIContainer.call(this);
    this.mFlags |= this.FlagSeal;
    this.mCols = this.mRows = 7;

    var unit = WIDTH / this.mCols;
    var x = unit / 2;
    var y = HEIGHT - unit / 2;
    var edge = unit - 2;
    for (var xindex = -1; ++xindex < this.mCols;) {
        for (var yindex = -1; ++yindex < this.mRows;) {
            var cell = new Cell(edge);
            cell.setAnthor(0.5, 0.5);
            cell.setPosition(x, y);
            this.addChild(cell);
            x += unit;
        }
        x = unit / 2;
        y -= unit;
    }
    this.setSize(WIDTH, HEIGHT);
}
_inherit(GameArea, _UIContainer);
GameArea.prototype.createEventNode = function () {
    return new _TouchNode(this);
}
GameArea.prototype.isInArea = function (vector) {
    if (vector[0] < 0 || vector[1] < 0) {
        return false;
    }
    if (vector[0] > WIDTH || vector[1] > HEIGHT) {
        return false;
    }
    return true;
}
GameArea.prototype.onTouch = function (event) {
    if (!this.isInArea(event.vector)) {
        return false;
    }
    console.log('GameArea:', event);
    return true;
}
GameArea.prototype.toString = function () {
    return 'area';
}

module.exports = GameArea;