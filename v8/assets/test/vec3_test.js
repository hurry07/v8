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

//var trans = new clz.vec3(10, 15, 20);
//var m  = new clz.matrix4();
//glm.translate(m, trans);
//m.translate(trans);
//
//var v1 = new clz.vec3(9, 6, 3);
//console.log(v1);
//
//var des = new clz.vec3();
//glm.mulMV3(des, m, v1);
//console.log(des);
////
////var v2 = new clz.vec2();
////console.log(v2);

console.log(new clz.vec2(1));
console.log(new clz.vec2(1, 2));
console.log(new clz.vec2(1, 2, 3));
console.log(new clz.vec2(new clz.vec2(2, 1)));
console.log(new clz.vec2(new clz.vec3(3, 2, 1)));
console.log(new clz.vec3(1));
console.log(new clz.vec3(1, 2));
console.log(new clz.vec3(1, 2, 3));
console.log(new clz.vec3(1, 2, 3, 4));
console.log(new clz.vec3(1, 2, new clz.vec2(100, 80)));
console.log(new clz.vec4(10, 30, new clz.vec2(100, 80)));
