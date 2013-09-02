/**
 * Created with JetBrains WebStorm.
 * User: jie
 * Date: 13-8-17
 * Time: 下午2:49
 * To change this template use File | Settings | File Templates.
 */
console.log('---------------');
var clz = require('nativeclasses');
var program = require('glcore/program.js');
var gl = require('opengl');
var math = require('glcore/math.js');
var glm = require('core/glm.js');

var primitives = require('glcore/primitives.js');
var texture = require('glcore/textures.js');
var Model = require('glcore/models.js');

//var fpsElem = document.getElementById("fps");

var matrix = clz.matrix;
var vector = clz.vector;
var vector4 = clz.vector4;

var canvas = {
    clientWidth : 800,
    clientHeight : 480
};
var g_eyeSpeed          = 0.5;
var g_eyeHeight         = 2;
var g_eyeRadius         = 9;

console.log('run 34');
function setupSphere() {
    var textures = {
    diffuseSampler: new texture.SolidTexture([128,128,128,128])
    };
    var p = program.createWithFile('shader/v1.vtx', 'shader/f1.frg');
    var arrays = primitives.createSphere(0.4, 10, 12);
    console.log('run 41');

    console.log('loadProgram:', p);
    return new Model(p, arrays, textures);
}
var sphere = setupSphere();
console.log('run 35');
var then = 0.0;
var clock = 0.0;

// pre-allocate a bunch of arrays
var projection = new matrix();
var view = new matrix();
var world = new matrix();
var worldInverse = new matrix();
var worldInverseTranspose = new matrix();
var viewProjection = new matrix();
var worldViewProjection = new matrix();
var viewInverse = new matrix();
var viewProjectionInverse = new matrix();
var eyePosition = new vector();
var target = new vector();
var up = new vector([0,1,0]);
var lightWorldPos = new vector();

var v3t0 = new vector();
var v3t1 = new vector();
var v3t2 = new vector();
var v3t3 = new vector();
var tempVec = new vector();
var m4t0 = new matrix();
var m4t1 = new matrix();
var m4t2 = new matrix();
var m4t3 = new matrix();
var zero4 = new vector4();
var one4 = new vector4([1,1,1,1]);
console.log(one4);

var sphereConst = {
    viewInverse: viewInverse,
    lightWorldPos: lightWorldPos,
    specular: one4,
    shininess: 50,
    specularFactor: 0.2
};
var spherePer = {
    lightColor: new vector4([0,0,0,1]),
    world: world,
    worldViewProjection: worldViewProjection,
    worldInverse: worldInverse,
    worldInverseTranspose: worldInverseTranspose
};

var frameCount = 0;
function render() {
    console.log('---run 00');
    var now = (new Date()).getTime() * 0.001;
    var elapsedTime;
    if(then == 0.0) {
        elapsedTime = 0.0;
    } else {
        elapsedTime = now - then;
    }
    then = now;

    clock += elapsedTime;
    eyePosition[0] = Math.sin(clock * g_eyeSpeed) * g_eyeRadius;
    eyePosition[1] = g_eyeHeight;
    eyePosition[2] = Math.cos(clock * g_eyeSpeed) * g_eyeRadius;
    
    console.log('---run 01');
    gl.colorMask(true, true, true, true);
    gl.depthMask(true);
    gl.clearColor(1,1,0,0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    
    glm.perspective(
                    projection,
                    math.degToRad(60),
                    canvas.clientWidth / canvas.clientHeight,
                    1,
                    5000);
    glm.lookAt(
               view,
               eyePosition,
               target,
               up);
    glm.mulMM(viewProjection, view, projection);
    glm.inverse(viewInverse, view);
    glm.inverse(viewProjectionInverse, viewProjection);
    
//    fast.matrix4.getAxis(v3t0, viewInverse, 0); // x
//    fast.matrix4.getAxis(v3t1, viewInverse, 1); // y;
//    fast.matrix4.getAxis(v3t2, viewInverse, 2); // z;
//    fast.mulScalarVector(v3t0, 10, v3t0);
//    fast.mulScalarVector(v3t1, 10, v3t1);
//    fast.mulScalarVector(v3t2, 10, v3t2);
    glm.addVec3(lightWorldPos, eyePosition, v3t0);
    glm.addVec3(lightWorldPos, lightWorldPos, v3t1);
    glm.addVec3(lightWorldPos, lightWorldPos, v3t2);
    
    //      view: view,
    //      projection: projection,
    //      viewProjection: viewProjection,
    
    sphere.drawPrep(sphereConst);
    console.log('draw 02');
    var across = 6;
    var lightColor = spherePer.lightColor;
    var half = (across - 1) * 0.5;
    for (var xx = 0; xx < across; ++xx) {
        for (var yy = 0; yy < across; ++yy) {
            for (var zz = 0; zz < across; ++zz) {
                lightColor[0] = xx / across;
                lightColor[1] = yy / across;
                lightColor[2] = zz / across;
                var scale = (xx + yy + zz) % 4 / 4 + 0.5;
                tempVec.set([scale, scale, scale]);
                glm.scale(m4t0, tempVec);
                tempVec.set([xx - half, yy - half, zz - half]);
                glm.translation(m4t1, tempVec);
                glm.mulMM(world, m4t0, m4t1);
                glm.mulMM(worldViewProjection, world, viewProjection);
                glm.inverse(worldInverse, world);
                glm.transpose(worldInverseTranspose, worldInverse);
                sphere.draw(spherePer);
            }
        }
    }
    
    // Set the alpha to 255.
    gl.colorMask(false, false, false, true);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
render();
//function aa(a, b, c, d) {
//    console.log(a, b, c, d);
//}
//function bb() {
//    aa.apply(this, arguments);
//}
//bb('a', 'baad', 'adfa');

