LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE    := v8_base_web
LOCAL_SRC_FILES := ./libs/libv8_base.arm.a
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE    := v8_nosnapshot_web
LOCAL_SRC_FILES :=  ./libs/libv8_nosnapshot.arm.a
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE    := v8android
LOCAL_C_INCLUDES := $(LOCAL_PATH)/include/
LOCAL_LDLIBS    := -llog
LOCAL_STATIC_LIBRARIES := v8_base_web v8_nosnapshot_web
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/include
include $(BUILD_SHARED_LIBRARY)
