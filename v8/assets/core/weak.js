var clz = require('nativeclasses');

function jsImplement() {
    /**
     * @param obj
     * @param callback
     * @constructor
     */
    function WeakRef(obj, callback) {
        this.obj = obj;
    }
    WeakRef.prototype.get = function () {
        return this.obj;
    };
    WeakRef.prototype.isNearDeath = function () {
        return false;
    };
    WeakRef.prototype.isDead = function () {
        return false;
    };
    WeakRef.prototype.callbacks = function () {
        return [];
    };
    WeakRef.prototype.addCallback = function (callback) {
        return false;
    };
}
var _weak = clz.weak || jsImplement();

exports.create = function(obj, callback) {
    return new _weak(obj, callback);
};
