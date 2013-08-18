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
console.log(glm);

//console.log(new clz.vec4f(new clz.vec2f(15, 21, 31, 41), new clz.vec2f(29, 39, 23, 17)));
var m = new clz.mat4f(
                          new clz.vec4f(15, 21, 31, 41),
                          new clz.vec4f(29, 39, 23, 17),
                          new clz.vec4f(23, 17, 29, 39),
                          new clz.vec4f(0, 1, 0, 1)
                          );
console.log(m);

var mat = new clz.matrix();
console.log(mat);
mat.translate(10, 20, 40);
console.log(mat);
var des = new clz.vector();
var v3 = new clz.vector(1,1,0.5);
glm.mulMV3(des, mat, v3);
console.log(des);