var _Node = require('render/node.js');
var _inherit = require('core/inherit.js');

function Container() {
    this.children = [];
}
_inherit(Container, _Node);
Container.prototype.addChild = function (child) {
    this.children.push(child);
}
Container.prototype.removeChild = function (child) {
    for (var i = 0, cs = this.children, l = cs.length; i < l; i++) {
        if (cs[i ] === child) {
            cs.splice(i, 1);
            break;
        }
    }
    return child;
}
Container.prototype.draw = function (context) {
    for (var i = 0, cs = this.children, l = cs.length; i < l; i++) {
        if (cs[i]) {
            cs[i].draw(context);
        }
    }
}

module.exports = Container;