var _UIContainer = require('component/uicontainer.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');

var WIDTH = 220;
var HEIGHT = 400;

function MessagePanel(game) {
    _UIContainer.call(this);
    this.game = game;

    this.setSize(WIDTH, HEIGHT);
    this.addChild(this.bg = _global.colorNode([40 / 255, 42 / 255, 45 / 255, 1], WIDTH, HEIGHT));
}
_inherit(MessagePanel, _UIContainer);
MessagePanel.prototype.resize = function (width) {
    this.bg.setSize(width, HEIGHT);
    this.setSize(width, HEIGHT);
}

module.exports = MessagePanel;