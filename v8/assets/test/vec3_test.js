/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
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

var ab = new clz.ArrayBuffer(10);
var slice = ab.slice(10, 20);
console.log('slice', slice);
console.log('slice', ab.isView(), ab.byteLength);
var farr = new clz.Float32Array(3);

//console.log('split1');
//var atest = new clz.ArrayBuffer();
//console.log(atest);

//var str="Hello happy world!";
//console.log(str.slice(6,11));
//console.log(str.slice(6,-1));
//console.log(str);

