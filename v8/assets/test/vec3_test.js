/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var gl = require('opengl');
var program = require('modules/program.js');
var vs = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');

