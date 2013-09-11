var _clz = require('nativeclasses');

function eventInterface() {
    function EventAccessor() {
    }

    EventAccessor.prototype = {
        /**
         * @param {Int32Array} buf
         * @return {Number}
         */
        getEvent: function (buf) {
        },
        /**
         * @param {Int32Array} buf
         * @return {Number}
         */
        getEvents: function (buf) {
        }
    }
    return EventAccessor;
}

exports.touchEvent = new _clz.EventAccess(16, 64) || eventInterface();
exports.keyEvent = new _clz.EventAccess(12, 64) || eventInterface();
