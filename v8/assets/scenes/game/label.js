var _Container = require('component/container.js');
var _inherit = require('core/inherit.js');

function Label(bg, text) {
    this.setSize(bg.getSize());
    this.addChild(bg);
    this.text = text;
}
_inherit(Label, _Container);

module.exports = Label;
