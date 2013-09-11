var _inherit = require('core/inherit.js');
var _Container = require('component/constainer.js');

function Button(id, skin) {
    _Container.call(this);
    this.mId = id;
    this.mSkin = skin;
    this.mDisable = false;
}
_inherit(Button, _Container);
Button.prototype.mId = 'button';
Button.prototype.drawContent = function() {
}

function createButton(normal, click, disable) {
}