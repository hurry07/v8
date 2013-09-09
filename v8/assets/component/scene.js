var _Container = require('component/container.js');
var _global = require('framework/global.js');
var _inherit = require('core/inherit.js');

function Scene() {
    _Container.call(this);
}
_inherit(Scene, _Container);
Scene.prototype.update = function (context) {
}

/**
 * create a anonymous scene class, this scene may used many times
 *
 * @param init
 * @param props
 * @returns {*}
 */
function createScene(init, props) {
    var clz = _inherit(function () {
        Scene.call(this);
    }, Scene, props);

    clz.newInstance = function () {
        var instance = new clz();
        init.apply(instance, arguments);
        return instance;
    }
    return clz;
}

exports.Scene = Scene;
exports.createScene = createScene;