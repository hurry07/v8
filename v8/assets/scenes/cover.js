var _global = require('framework/global.js');
var _scene = require('component/scene.js');
var _Button = require('component/button.js');
var R = require('framework/r.js');

module.exports = _scene.createScene(function () {
    for (var i in arguments) {
        console.log('cover.export:' + i);
    }

    var $9patch = _global.sprite(R.word).$9patch().left(200).bottom(200).top(200).right(200).setSize(1024, 600).updateMesh();
    $9patch.setScale(0.5);
    this.addChild($9patch);

    var $9patch_h = _global.sprite(R.upgrade.b_01).$9patch_v().top(20).bottom(20).setSize(0, 300).updateMesh();
    this.addChild($9patch_h);

    var button = _Button.createButtonWithId('bt_1', _global.spriteNode(R.ui.bt_));

    this.mRotate = 0;
}, {
    update: function (context) {
        this.mRotate += 100 * context.stride();
        if (this.mRotate > 360) {
            this.mRotate -= 360;
        }
        this.setRotate(this.mRotate);
    }
});
