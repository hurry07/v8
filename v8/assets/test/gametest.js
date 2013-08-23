/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');

var AttribBuffer = require('modules/buffer.js');
var primitives = require('modules/primitives.js');

var arrays = primitives.createSphere(0.4, 10, 12);
console.log(arrays);
for(var i in arrays) {
    console.log(i, arrays[i]);
}

console.log(arrays.texCoord.getElement(0));
console.log(arrays.normal.getElement(0));
console.log(arrays.position.getElement(0));
