/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
//var gl = require('opengl');
//var program = require('modules/program.js');
//var vs = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');

//new ArrayBuffer(10);
//
//var a1 = new ArrayBuffer(16);
//var f1 = new Float32Array(a1);
//f1[0] = 10;
//f1[1] = 20;
//f1[2] = 30;
//f1[3] = 40;
//
//var a2 = a1.slice(4, -4);
//var f2 = new Float32Array(a2);
//console.log(f2[0]);
//console.log(f2[1]);
//console.log(f2[2]);

var m = new clz.vec4f();
console.log(m.length);
for(var i=0,len=m.length;i<len;i++) {
    console.log(m[i]);
    m[i] = i + 10;
}
console.log('====');
for(var i=0,len=m.length;i<len;i++) {
    console.log(m[i]);
}

