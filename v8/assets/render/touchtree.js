var _geometry = require('core/glm.js');
var _glm = _geometry.glm;
var _Matrix = _geometry.matrix;

function TouchNode(node) {
    this.node = node;
    this.children = [];
    this.matrix = new _Matrix();
}