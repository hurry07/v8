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

import android.app.Activity;
import android.content.res.AssetManager;
import android.os.Bundle;

public class JSActivity extends Activity {

	static {
		System.loadLibrary("v8");
		System.loadLibrary("glm");
		System.loadLibrary("freetype_gl");
		System.loadLibrary("game");
	}

	private AssetManager mgr;

	private JSSurfaceView mView;

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
		mView = new JSSurfaceView(getApplication());
		setContentView(mView);
	}

	@Override
	protected void onDestroy() {
		jsDestory();
		super.onDestroy();
	}

	@Override
	protected void onPause() {
		super.onPause();
		mView.onPause();
	}

	@Override
	protected void onResume() {
		super.onResume();
		//mView.onResume();
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
