var _Node = require('component/node.js');
var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _matrix = _geometry.matrix4;
var _inherit = require('core/inherit.js');

function Container() {
    _Node.call(this);
    this.children = [];
    this.mTouchMatrix = new _matrix();
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
    if (!this.mVisiable) {
        return;
    }
    this.updateMatrix();
    context.pushMatrix(this.mMatrix);
    this.drawContent(context);
    context.popMatrix();
}
Container.prototype.drawContent = function (context) {
    for (var i = 0, cs = this.children, l = cs.length; i < l; i++) {
        if (cs[i]) {
            cs[i].draw(context);
        }
    }
}
Container.prototype.onTouch = function (event) {
}

module.exports = Container;