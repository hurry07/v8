var _scene = require('component/scene.js');
var _global = require('framework/global.js');
var R = require('framework/r.js');

module.exports = _scene.createScene(function (x, y) {
    console.log('coverscene', x, y);

    this.$9patch = _global.sprite(R.word).$9patch().left(200).bottom(200).top(200).right(200).setSize(1024, 600).updateMesh();
    this.$9patch.setScale(0.5);
    this.addChild(this.$9patch);

    this.$9patch_h = _global.sprite(R.upgrade.b_01).$9patch_v().top(20).bottom(20).setSize(0, 300).updateMesh();
    this.addChild(this.$9patch_h);

    this.mRotate = 0;
}, {
    update: function (context) {
        this.mRotate += 100 * context.stride();
        this.setRotate(this.mRotate);
    }
});
