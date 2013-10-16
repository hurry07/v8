# Copyright (C) 2009 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
LOCAL_PATH:= $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE    := libgl2jni
LOCAL_CFLAGS    := -Werror -Wno-psabi
LOCAL_LDLIBS    := -llog -lGLESv2 -landroid -lc -lz
LOCAL_SRC_FILES := app/Application.cpp \
	autorelease/ReleaseImpl.cpp \
	classes/AutoRelease.cpp \
	classes/file.cpp \
	classes/Font.cpp \
	classes/gcobserver.cpp \
	classes/NativeClass.cpp \
	classes/TextureAtlas.cpp \
	core/bytebuffer.cpp \
	core/ClassBase.cpp \
	core/JSObject.cpp \
	core/RingBuffer.cpp \
	core/v8Utils.cpp \
	functions/array.cpp \
	glm/glmopt.cpp \
	global.cpp \
	modules/CCImage.cpp \
	modules/CCTexture2D.cpp \
	modules/Console.cpp \
	modules/event.cpp \
	modules/GLBinding.cpp \
	modules/Image.cpp \
	typedbuffer/arraybuffer.cpp \
	typedbuffer/arraybufferview.cpp \
	utils/Arguments.cpp \
	utils/AssetUtil.cpp \

#LOCAL_SHARED_LIBRARIES := js_shared_prebuilt
LOCAL_SHARED_LIBRARIES := cocos_jpeg_static
LOCAL_SHARED_LIBRARIES += cocos_libpng_static
#LOCAL_SHARED_LIBRARIES += cocos_libwebp_static
LOCAL_SHARED_LIBRARIES += cocos_curl_static
LOCAL_SHARED_LIBRARIES += libft2
LOCAL_SHARED_LIBRARIES += libfreetype_gl

#LOCAL_STATIC_LIBRARIES := v8_static
LOCAL_STATIC_LIBRARIES := v8android
LOCAL_STATIC_LIBRARIES += ejecta_libpng_static
LOCAL_STATIC_LIBRARIES += glm

include $(BUILD_SHARED_LIBRARY)

$(call import-module,libcurl)
$(call import-module,libjpeg)
$(call import-module,libpng)
#$(call import-module,libwebp)
$(call import-module,platform_external_freetype)
$(call import-module,freetype-gl-read-only)
$(call import-module,libv8)
$(call import-module,libglm)

