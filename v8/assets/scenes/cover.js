var _global = require('framework/global.js');
var _scene = require('component/scene.js');
var _button = require('widget/button.js');
var R = require('framework/r.js');

function n9patchBt(id1, id2, left, right, width) {
    var p1 = _global.sprite(id1).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    var p2 = _global.sprite(id2).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    return _button.createButtonWithId('bt_1', p1, p2);
}

module.exports = _scene.createScene(function () {
//    var $9patch = _global.sprite(R.word).$9patch().left(200).bottom(200).top(200).right(200).setSize(1024, 600).updateMesh();
//    $9patch.setScale(0.5);
//    this.addChild($9patch);

    this.addChild(n9patchBt(R.upgrade.b_shop_01, R.upgrade.b_shop_02, 40, 30, 300));
//    console.log('n9patchBt 02');

//    var p1 = _global.sprite(R.upgrade.b_shop_01).$9patch_h().left(40).right(30).setSize(300, 0).updateMesh();
//    this.addChild(p1);

//    var $9patch_h = _global.sprite(R.upgrade.b_01).$9patch_v().top(20).bottom(20).setSize(0, 300).updateMesh();
//    this.addChild($9patch_h);

    this.mRotate = 0;
}, {
    update: function (context) {
//        this.mRotate += 100 * context.stride();
//        if (this.mRotate > 360) {
//            this.mRotate -= 360;
//        }
//        this.setRotate(this.mRotate);
    }
});
