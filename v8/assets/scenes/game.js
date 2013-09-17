var _scene = require('component/scene.js');
var _GameArea = require('scenes/gamearea.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;

module.exports = _scene.createScene(
    function (w, h) {
        this.setSize(w, h);
        this.addChild(this.gamearea = new _GameArea());

        this.layout();
        this.__touchnode__.print();
    }, {
        update: function (context) {
        },
        onSizeChange: function (w, h) {
            this.layout();
        },
        layout: function () {
            _relative.layout(this.gamearea, 0, 0, 200, 50);
        }
    });
