var _weak = require('core/weak.js');

exports.a = {name: 'jack'};
var a_ref = _weak.create(exports.a, function () {
    console.log('weak release callback', this.name);
});
exports.a = {name: 'unknow'};

exports.a_ref = a_ref;
exports.check = function () {
    console.log('==============weak.test');
    console.log('weak.isDead', a_ref.isDead());
    console.log('weak.isNearDeath', a_ref.isNearDeath());
    console.log('weak.get', a_ref.get());
    console.log('weak.same', a_ref.get() === exports.a);
}