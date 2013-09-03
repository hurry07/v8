var _inherit = require('core/inherit.js');
var _Node = require('render/node.js');

function Sprite(frame) {
    _Node.call(this);

    this.mFrame = frame;
}
_inherit(Sprite, _Node);
Sprite.prototype.draw = function () {
}