/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
var glm = new clz.glm();
var gl  = require('opengl');
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
//
var mat = new clz.matrix();
console.log(mat);
mat.translate(10, 20, 40);
console.log(mat);
//
//var des = new clz.vector();
//var v3 = new clz.vector(1,1,0.5);
//glm.mulMV3(des, mat, v3);
//
//console.log(v3);
//console.log(des);
//
var mT = new clz.matrix(mat);
console.log(mT);
//
//var gl = require('opengl');
//var shader = require('modules/shader.js');
//var vs = shader.createWithFile('v1', 'shader/f1.frg', gl.VERTEX_SHADER);
//var fs = shader.createWithFile('f1', 'shader/v1.vtx', gl.FRAGMENT_SHADER);
//console.log(vs.getGLId(), fs.getGLId());

var program = require('modules/program.js');
var p = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');

//var farr = new Float32Array([100, 20, 30]);
//gl.uniform1fv(0, mat);
//gl.uniform1fv(0, farr);
//
////var ab = new ArrayBuffer();
//var fb = new Float32Array();

var atest = new clz.ArrayBuffer();

//var str="Hello happy world!";
//console.log(str.slice(6,11));
//console.log(str.slice(6,-1));
//console.log(str);

