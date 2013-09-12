var _global = require('framework/global.js');
var _scene = require('component/scene.js');
var _button = require('widget/button.js');
var _layout = require('tools/layout.js');
var _relative = _layout.relative;
var _absoult = _layout.absolute;
var R = require('framework/r.js');

function n9patchBt(id, id1, id2, left, right, width, sprite) {
    var p1 = _global.sprite(id1).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    var p2 = _global.sprite(id2).$9patch_h().left(left).right(right).setSize(width, 0).updateMesh();
    var bt = _button.createButtonWithId(id, p1, p2);
    if (sprite) {
        var sp = _global.spriteNode(sprite);
        var p = _relative.localPoint(bt, 0.5, 0.5);
        _relative.layout(sp, [0.5, 0.5], _relative.localPoint(bt, 0.5, 0.5));
        bt.addChild(sp);
    }
    return bt;
}

module.exports = _scene.createScene(
    function (w, h) {
        this.setSize(w, h);

        this.mBg = _global.sprite(R.upgrade.bg).$9patch_h().left(30).right(30).setSize(w, h).updateMesh();
        _layout.relative.layoutTo(this.mBg, 0, 0, this, 0, 0);
        this.addChild(this.mBg);

        this.addChild(n9patchBt('bt_avator', R.upgrade.b_shop_01, R.upgrade.b_shop_02, 40, 30, 155, R.upgrade.b_z_avatar));
//        this.addChild(n9patchBt('bt_skill', R.upgrade.b_shop_01, R.upgrade.b_shop_02, 40, 30, 155));
//        this.addChild(n9patchBt('bt_achive', R.upgrade.b_shop_01, R.upgrade.b_shop_02, 40, 30, 155));

        this.mRotate = 0;
    }, {
        update: function (context) {
//            this.mRotate += 100 * context.stride();
//            if (this.mRotate > 360) {
//                this.mRotate -= 360;
//            }
//            this.mBg.setRotate(this.mRotate);
        },
        onSizeChange: function (w, h) {
            this.mBg.setSize(w, h).updateMesh();
        }
    });
