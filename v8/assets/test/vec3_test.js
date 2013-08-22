/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
//console.log(Float32Array === clz.Float32Array);
//var glm = new clz.glm();
//glm.init(111);
//glm.init.call({}, 222);
//var gl  = require('opengl');
//console.log(glm);
//
//console.log(new clz.vec4f(new clz.vec2f(15, 21, 31, 41), new clz.vec2f(29, 39, 23, 17)));
//var m = new clz.mat4f(
//                          new clz.vec4f(15, 21, 31, 41),
//                          new clz.vec4f(29, 39, 23, 17),
//                          new clz.vec4f(23, 17, 29, 39),
//                          new clz.vec4f(0, 1, 0, 1)
//);
//console.log(m);
//var v2 = new clz.vec2f(10, 10);
//v2.init(20, 28);
//console.log(v2);
//
//var mat = new clz.matrix();
//console.log(mat);
//mat.translate(10, 20, 40);
//console.log(mat);
//
//var des = new clz.vector();
//var v3 = new clz.vector(1,1,0.5);
//glm.mulMV3(des, mat, v3);
//
//console.log(v3);
//console.log(des);
//
//var mT = new clz.matrix(mat);
//console.log(mT);
//var gl = require('opengl');
//var shader = require('modules/shader.js');
//var vs = shader.createWithFile('v1', 'shader/f1.frg', gl.VERTEX_SHADER);
//var fs = shader.createWithFile('f1', 'shader/v1.vtx', gl.FRAGMENT_SHADER);
//console.log(vs.getGLId(), fs.getGLId());

//var program = require('modules/program.js');
//var p = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');

//var farr = new Float32Array([100, 20, 30]);
//gl.uniform1fv(0, mat);
//gl.uniform1fv(0, farr);
//
////var ab = new ArrayBuffer();
//var fb = new Float32Array();

//var farr = new Float32Array([10, 11, 12, 13, 14]);
//console.log(farr, farr.length);
//var f1 = farr.subarray(-2, -1);
//console.log(f1, f1.length);
//console.log(f1[0], f1[1], f1[2], f1[3]);
//f1[3] = 15;
//console.log(f1[0], f1[1], f1[2], f1[3]);

//var ab = new clz.ArrayBuffer(16);
//var slice = ab.slice(10, 20);
//console.log('slice', slice);
//console.log('slice', ab.isView(), ab.byteLength);
//var farr = new clz.Float32Array(ab, 0, 4);
//console.log('Float32Array', farr.length);
//console.log('Float32Array', farr.byteOffset, farr.byteLength);
//console.log('Float32Array', farr[0], farr[1], farr[2], farr[3], farr[4]);
//farr[0] = 100;
//farr[1] = 101;
//farr[2] = 102;
//farr[3] = 103;
//console.log('Float32Array', farr.length, farr[0], farr[1], farr[2], farr[3], farr[4]);

//var arr = [100, 101];
//console.log(arr.length, arr[0], arr[1]);
//arr.length = 100;
//arr[0] = 200;
//console.log(arr.length, arr[0], arr[1], arr[3]);
//console.log(arr.__proto__.length, arr.__proto__[0]);

//console.log('split1');
//var atest = new clz.ArrayBuffer();
//console.log(atest);

//// create an 8-byte ArrayBuffer
//var b = new clz.ArrayBuffer(8);
//
//// create a view v1 referring to b, of type Int32, starting at
//// the default byte index (0) and extending until the end of the buffer
//var v1 = new clz.Int32Array(b);
//
//// create a view v2 referring to b, of type Uint8, starting at
//// byte index 2 and extending until the end of the buffer
//var v2 = new clz.Uint8Array(b, 2);
//
//// create a view v3 referring to b, of type Int16, starting at
//// byte index 2 and having a length of 2
//var v3 = new clz.Int16Array(b, 2, 2);
//
//v2[0] = 0xff;
//v2[1] = 0xff;
//console.log(v3[0]);

//var vf_all = new clz.Float32Array(b, 0, 8);
//console.log(vf_all.length);
//var vf_1 = new clz.Float32Array(b, 0, 4);
//console.log(vf_1.length);
//vf_1[0] = 100;
//var vf_2 = new clz.Float32Array(b, 4, 4);
//console.log(vf_2.length);
//vf_2[0] = 200;
//
//console.log(vf_all[0],vf_all[1],vf_all[2]);

function printVec(v) {
    var s = '';
    for(var i=0,len = v.length;i<len;i++) {
        s += ',' + v[i]
    }
    console.log('length:' + v.length + s);
}

var v4 = new clz.vec4f(1, 2, 3, 4);
var b = new ArrayBuffer(32);
var f1 = new Float32Array(b, 0, 16);
var f2 = new Float32Array(b, 16, 16);

v4._value(b);
printVec(f1);
printVec(f2);

v4._value(f2);
printVec(f1);
printVec(f2);

//var str="Hello happy world!";
//console.log(str.slice(6,11));
//console.log(str.slice(6,-1));
//console.log(str);

