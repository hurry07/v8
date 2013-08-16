//
//  glmopt.cpp
//  v8
//
//  Created by jie on 13-8-16.
//  Copyright (c) 2013年 jie. All rights reserved.
//

#include "glmopt.h"
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/swizzle.hpp>

#include "../core/v8Utils.h"
#include "../core/ClassWrap.h"
#include "matrix3.h"
#include "matrix4.h"
#include "vec3.h"
#include "vec4.h"

Glm::Glm() {
}

METHOD_BEGIN(inverse, info) {
    HandleScope scope;
    
    Matrix4* res = internalArg<Matrix4>(info[0]);
    Matrix4* m1 = internalArg<Matrix4>(info[1]);
    
    res->mMatrix = glm::inverse(m1->mMatrix);
}
METHOD_BEGIN(mul, info) {
    HandleScope scope;
    
    Matrix4* res = internalArg<Matrix4>(info[0]);
    Matrix4* m1 = internalArg<Matrix4>(info[1]);
    Matrix4* m2 = internalArg<Matrix4>(info[2]);
    
    res->mMatrix = m1->mMatrix * m2->mMatrix;
}
/**
 * @param m
 * @param vec3
 */
METHOD_BEGIN(setTranslation, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    Vec3* v = internalArg<Vec3>(info[1]);
    
    m->mMatrix[3] = glm::vec4(v->mVec, 1);
}
/**
 * @param vec3
 * @param m
 */
METHOD_BEGIN(getTranslation, info) {
    HandleScope scope;

    Matrix4* m = internalArg<Matrix4>(info[1]);
    internalArg<Vec3>(info[0])->mVec = m->mMatrix[3].swizzle(glm::X, glm::Y, glm::Z);
}
METHOD_BEGIN(identity, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    m->mMatrix = glm::mat4(1);
}
/**
 * float fovy, 
 * float aspect, 
 * float zNear, 
 * float zFar
 * 
 * vec4
 */
METHOD_BEGIN(perspective, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    if(info.Length() == 2) {
        glm::vec4& v4 = internalArg<Vec4>(info[0])->mVec;
        m->mMatrix = glm::perspective(v4.x, v4.y, v4.z, v4.w);
    } else {
        m->mMatrix = glm::perspective(V_2F(1), V_2F(2), V_2F(3), V_2F(4));
    }
}
/**
 * Computes a 4-by-4 othogonal transformation matrix given the left, right,
 * bottom, and top dimensions of the near clipping plane as well as the
 * near and far clipping plane distances.
 * @param {!tdl.fast.Matrix4} dst Output matrix.
 * @param {number} left Left side of the near clipping plane viewport.
 * @param {number} right Right side of the near clipping plane viewport.
 * @param {number} top Top of the near clipping plane viewport.
 * @param {number} bottom Bottom of the near clipping plane viewport.
 * @param {number} near The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} far The depth (negative z coordinate)
 *     of the far clipping plane.
 * @return {!tdl.fast.Matrix4} The perspective matrix.
 */
METHOD_BEGIN(ortho, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    m->mMatrix = glm::ortho(V_2F(1), V_2F(2), V_2F(3), V_2F(4), V_2F(5), V_2F(6));
}
/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {!tdl.fast.Matrix4} The perspective projection matrix.
 */
METHOD_BEGIN(frustum, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    m->mMatrix = glm::frustum(V_2F(1), V_2F(2), V_2F(3), V_2F(4), V_2F(5), V_2F(6));
}
/**
 detail::tvec3<T> const & eye,
 detail::tvec3<T> const & center,
 detail::tvec3<T> const & up
 */
METHOD_BEGIN(lookAt, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    if(info.Length() == 2) {
        glm::mat3 m3 = internalArg<Matrix3>(info[1])->mMatrix;
        m->mMatrix = glm::lookAt(m3[0], m3[1], m3[2]);
    } else {
        Vec3* eye = internalArg<Vec3>(info[1]);
        Vec3* center = internalArg<Vec3>(info[2]);
        Vec3* up = internalArg<Vec3>(info[3]);
        m->mMatrix = glm::lookAt(eye->mVec, center->mVec, up->mVec);
    }
}
METHOD_BEGIN(translation, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    Vec3* t = internalArg<Vec3>(info[1]);
    m->mMatrix = glm::mat4(1);
    m->mMatrix[3] = glm::vec4(t->mVec, 1);
}
METHOD_BEGIN(translate, info) {
    HandleScope scope;
    
    Matrix4* m = internalArg<Matrix4>(info[0]);
    Vec3* v = internalArg<Vec3>(info[1]);
    
    m->mMatrix = glm::translate(m->mMatrix, v->mVec);
}

static v8::Local<v8::Function> initClass(v8::Handle<v8::FunctionTemplate>& temp) {
    HandleScope scope;

    Local<ObjectTemplate> obj = temp->PrototypeTemplate();
    EXPOSE_METHOD(obj, inverse, ReadOnly | DontDelete);
    EXPOSE_METHOD(obj, mul, ReadOnly | DontDelete);

    return scope.Close(temp->GetFunction());
}
class_struct* Glm::getExportStruct() {
    static class_struct mTemplate = {
        initClass, "glm", CLASS_GLM
    };
    return &mTemplate;
}
ClassType Glm::getClassType() {
    return CLASS_GLM;
}