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

function printBuffer(buf) {
    var s = '';
    for(var i=-1,len=buf.length;++i<len;) {
        s += ' ,' + buf[i];
    }
    console.log('length:' + buf.length, s);
}

function test1() {
    new ArrayBuffer(10);
    
    var a1 = new ArrayBuffer(16);
    var f1 = new Float32Array(a1);
    f1[0] = 10;
    f1[1] = 20;
    f1[2] = 30;
    f1[3] = 40;
    
    var a2 = a1.slice(4, -4);
    var f2 = new Float32Array(a2);
    console.log(f2[0]);
    console.log(f2[1]);
    console.log(f2[2]);
}
function test2() {
    new ArrayBuffer(10);
    
    var a1 = new ArrayBuffer(16);
    var f1 = new Float32Array(a1, 4, 2);
    f1[0] = 10;
    f1[1] = 20;
    f1[2] = 30;

    var f2 = new Float32Array(a1);
    console.log(f2[0]);
    console.log(f2[1]);
    console.log(f2[2]);
    console.log(f2[3]);
}
function testSubArray() {
    var a1 = new ArrayBuffer(16);

    var f1 = new Float32Array(a1);
    f1[0] = 10;
    f1[1] = 20;
    f1[2] = 30;
    f1[3] = 40;
    printBuffer(f1);

    var f2 = f1.subarray(0);
    printBuffer(f2);
    var f3 = f1.subarray(1);
    printBuffer(f3);

    var a2 = a1.slice(8, 16);

    f3[1] = 100;
    var f4 = f1.subarray(1,-1);
    printBuffer(f4);
    var f5 = f1.subarray(2,3);
    printBuffer(f5);

    console.log('----------------');
    printBuffer(f1);
    printBuffer(f2);
    printBuffer(f3);
    printBuffer(f4);
    printBuffer(f5);
    
    console.log('----------------');
    var f1_1 = new Float32Array(a2);
    printBuffer(f1_1);
}
function testVecSet() {
    var v2 = new clz.vec2i(100, 200);
//    console.log(v2, v2.length);
//    v2.set([100]);
//    console.log(v2);
//    v2.set([100, 200]);
//    console.log(v2);
//    v2.set([150]);
//    console.log(v2);

    var m = new clz.mat3i();
    printBuffer(m);
//    printBuffer(v2);
    m.set(v2);
    printBuffer(m);
}
//console.log('------------------');
//test1();
//console.log('------------------');
//test2();
//testSubArray();
testVecSet();

//var m = new clz.vec4f();
//console.log(m.length);
//for(var i=0,len=m.length;i<len;i++) {
//    console.log(m[i]);
//    m[i] = i + 10;
//}
//console.log('====');
//for(var i=0,len=m.length;i<len;i++) {
//    console.log(m[i]);
//}

