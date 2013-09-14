var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _Matrix = _geometry.matrix;

function TouchNode(node) {
    node.__touchnode__ = this;

    this.node = node;
    this.children = [];
    this.matrix = new _Matrix();
}
TouchNode.prototype.addChild = function(child) {
    this.children.push();
}

function NodeListener() {
}
NodeListener.prototype.onNodeAdd = function (parent, child) {
}
NodeListener.prototype.onNodeRemove = function (parent, child) {
}
NodeListener.prototype.onNodeMove = function (from, to, child) {
}
NodeListener.prototype.onCreate = function (node, eventpipe) {
}
