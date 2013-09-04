var _Buffer = require('core/buffer.js');
var _glm = require('core/glm.js');
var _Matrix = _glm.matrix4;
var _inherit = require('core/inherit.js');

function Stack(depth) {
    _Buffer.call(this, {
        stride: 16,
        count: depth,
        type: Float32Array,
        element: _Matrix
    });
}
_inherit(Stack, _Buffer);
Stack.prototype.push = function (m) {
    _Buffer.setElement(this.mCount, m);
}
