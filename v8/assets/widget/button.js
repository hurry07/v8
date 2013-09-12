var _inherit = require('core/inherit.js');
var _Container = require('component/container.js');

function Button(id, skin) {
    _Container.call(this);

    (id != undefined && id != null) && (this.mId = id);
    this.mSkin = skin;
    this.setSize(skin.width(), skin.height());
}
_inherit(Button, _Container);
Button.prototype.mId = 'button';
Button.prototype.drawContent = function (context) {
    this.mSkin.draw(context);
}

function Skin() {
    this.valid = true;
    this.state = 'n';// n,c,d
}
Skin.prototype.init = function (normal, click, disable) {
    var l = arguments.length;
    if (l == 0) {
        this.valid = false;
    }
    if (l == 1) {
        this.normal = this.click = this.disable = normal;
    } else if (l == 2) {
        this.normal = this.disable = normal;
        this.click = click;
    } else {
        this.normal = normal;
        this.click = click;
        this.disable = disable;
    }
}
Skin.prototype.width = function () {
    if (this.valid) {
        return this.normal.width();
    }
    return 0;
}
Skin.prototype.height = function () {
    if (this.valid) {
        return this.normal.height();
    }
    return 0;
}
Skin.prototype.draw = function (context) {
    if (!this.valid) {
        return;
    }
    switch (this.state) {
        case 'n':
            this.normal.draw(context);
            break;
        case 'c':
            this.click.draw(context);
            break;
        case 'd':
            this.disable.draw(context);
            break;
    }
}

function createButtonWithId(id, normal, click, disable) {
    var s = new Skin();
    s.init.apply(s, Array.prototype.slice.call(arguments, 1));
    return new Button(id, s);
}
function createButton(normal, click, disable) {
    var s = new Skin();
    s.init.apply(s, arguments);
    return new Button(null, s);
}

exports.createButton = createButton;
exports.createButtonWithId = createButtonWithId;