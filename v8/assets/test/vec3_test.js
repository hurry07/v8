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
    var v2 = new clz.vec2f(100, 200);
    console.log(v2, v2.length);
    v2.set([100]);
    console.log(v2);
    v2.set([100, 200]);
    console.log(v2);
    v2.set([150]);
    console.log(v2);

    var m = new clz.mat3i();
    printBuffer(m);
    printBuffer(v2);
    v2.set([1511, 222]);
    m.set(v2, 3);
    printBuffer(m);
}
function testBufferSet() {
    var a = new ArrayBuffer(64);
    var f = new Float32Array(a);
//    f.set([10, 11], 1);
//    printBuffer(f);
//    f.set([10, 11]);
//    printBuffer(f);
//    f.set([10, 11], 14);
//    printBuffer(f);

//    var f2 = new Float32Array([1,2,3,4]);
//    f.set(f2, 8);
//    printBuffer(f);
//    console.log('11');
//    f2.set([9,8,7,6]);
//    printBuffer(f2.buffer);
//    console.log(f2.buffer);
//    console.log('22');
//    f.set(f2.buffer, 8);
//    printBuffer(f);
    
    var b = new Int8Array(16);
    var f2 = new Float32Array(b.buffer);
    printBuffer(f2);
    f2.set([1,2,3,4]);
    printBuffer(f2);
    
    f.set(b.buffer, 10);
    printBuffer(f);
}
function testBufferGet() {
    var f1 = new Float32Array(20);
    for(var i = 0;i< 16;i++) {
        f1[i] = i;
    }
    printBuffer(f1);
    
    var v1 = new clz.vec4f();
    f1.get(v1);
    printBuffer(v1);
    f1.get(v1, 4);
    printBuffer(v1);
    
    var a1 = new ArrayBuffer(20);
    f1.get(a1, 6);
    var f2 = new Float32Array(a1);
    printBuffer(f2);
    f1.get(a1, 10);
    printBuffer(f2);
    
    var m1 = new clz.matrix();
    printBuffer(m1);
    f1.get(m1);
    printBuffer(m1);
    f1.get(m1, 1);
    printBuffer(m1);
    
    var m2 = new clz.matrix();
    f1.set(m2);
    printBuffer(f1);
    
    f1[15] = 100;
    m2.set(f1);
    printBuffer(m2);
}
//console.log('------------------');
//test1();
//console.log('------------------');
//test2();
//testSubArray();
//testVecSet();
//testBufferSet();
//testBufferGet();

var AttribBuffer = require('modules/buffer.js');
console.log(AttribBuffer);

var coll = new AttribBuffer(3, 10, clz.vec3f);
var v0 = coll.getElement(0);
coll.setElement(8, new clz.vec3f(10,18,20));
coll.setElement(0, new clz.vec3f(1,2,3));
console.log(v0);

var coll2 = coll.clone();
console.log(coll2.getElement(0));
console.log(coll2.getElement(8));

coll.setElement(6, new clz.vec3f(50,100,23));
console.log(coll2.getElement(6), 100);

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

