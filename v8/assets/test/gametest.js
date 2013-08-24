/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
var program = require('modules/program.js');
console.log('program:', program);
for(var i in program) {
    console.log(i);
}

var bytedbuffer = require('modules/typedbuffer.js');
var primitives = require('modules/primitives.js');
var texture = require('modules/textures.js');
var Model = require('modules/models.js');

//var arrays = primitives.createSphere(0.4, 10, 12);
//console.log(arrays);
//for(var i in arrays) {
//    console.log(i, arrays[i]);
//}
//
//program.createWithFile('shader/v1.vtx', 'shader/f1.frg');

function setupSphere() {
    var textures = {
        diffuseSampler: new texture.SolidTexture([128,128,128,128])
    };
    var p = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');
    var arrays = primitives.createSphere(0.4, 10, 12);

    return new Model(p, arrays, textures);
}
setupSphere();

