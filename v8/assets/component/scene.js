var _Container = require('component/container.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');

function Scene() {
    _Container.call(this);
    _global.scheduleUpdate.add(this);
    _global.scheduleRender.add(this);
}
_inherit(Scene, _Container);
Scene.prototype.update = function (context) {
}

/**
 * create a anonymous scene instance
 *
 * @param init
 * @param props
 * @returns {subScene}
 */
function createScene(init, props) {
    return new subScene(init, props);
}
/**
 * create a anonymous scene class, this scene may used many times
 *
 * @param init
 * @param props
 * @returns {*}
 */
function subScene(init, props) {
    return _inherit(function () {
        Scene.call(this);
        init();
    }, Scene, props);
}

exports.Scene = Scene;
exports.subScene = subScene;
exports.createScene = createScene;