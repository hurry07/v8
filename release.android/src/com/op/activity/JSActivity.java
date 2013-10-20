/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.op.activity;

import java.io.IOException;
import java.io.InputStream;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.app.Activity;
import android.content.res.AssetManager;
import android.opengl.GLSurfaceView;
import android.opengl.GLSurfaceView.Renderer;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.FrameLayout;

public class JSActivity extends Activity {

    static {
        System.loadLibrary("v8");
        System.loadLibrary("glm");
        System.loadLibrary("freetype_gl");
        System.loadLibrary("game");
    }

    private AssetManager  mgr;

    private GLSurfaceView mView;

    public GLSurfaceView onCreateView() {
        // FrameLayout
        ViewGroup.LayoutParams framelayout_params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        FrameLayout framelayout = new FrameLayout(this);
        framelayout.setLayoutParams(framelayout_params);

        //        JSSurfaceView gLSurfaceView = new JSSurfaceView(this);
        //        framelayout.addView(gLSurfaceView);
        GLSurfaceView view = new GLSurfaceView(this);
        final JSRender render = new JSRender();
        view.setRenderer(new Renderer() {

            @Override
            public void onSurfaceCreated(GL10 gl, EGLConfig config) {
                render.onSurfaceCreated(gl, config);
            }

            @Override
            public void onSurfaceChanged(GL10 gl, int width, int height) {
                render.onSurfaceChanged(gl, width, height);
            }

            @Override
            public void onDrawFrame(GL10 gl) {
                render.onDrawFrame(gl);
            }
        });
        framelayout.addView(view);

        setContentView(framelayout);
        //        return gLSurfaceView;
        return view;
    }

    @Override
    protected void onCreate(Bundle icicle) {
        super.onCreate(icicle);

        // prepare tools
        mgr = getAssets();
        initWithAsset(mgr);
        System.out.println("initWithAsset===========");

        try {
            InputStream in = mgr.open("images/upgrade/split_v.png");
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        jsCreate();
//        mView = onCreateView();
    }

    @Override
    protected void onDestroy() {
//        jsDestory();
        super.onDestroy();
//        System.out.println("JSActivity.onDestroy=============()");
    }

    @Override
    protected void onPause() {
        super.onPause();
//        mView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
//        mView.onResume();
    }

    /**
     * 使用 asset 来初始化上下文
     * 
     * @param assetManager
     */
    public native void initWithAsset(AssetManager assetManager);

    public static native void jsCreate();

    public static native void jsDestory();

    public static native void evalScript(String script);
}
