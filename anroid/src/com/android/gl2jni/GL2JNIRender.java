package com.android.gl2jni;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.opengl.GLSurfaceView;

public class GL2JNIRender implements GLSurfaceView.Renderer {

    @Override
    public native void onDrawFrame(GL10 arg0);

    @Override
    public native void onSurfaceChanged(GL10 arg0, int arg1, int arg2);

    @Override
    public native void onSurfaceCreated(GL10 arg0, EGLConfig arg1);
}
