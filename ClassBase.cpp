
#include "ClassBase.h"

ClassBase::ClassBase() : mRelease(false) {
}
ClassBase::~ClassBase() {
}

void ClassBase::release() {
}
void ClassBase::jsRelease() {
    if(!mRelease) {
        release();
        mRelease = true;
    }
}
void ClassBase::init(const FunctionCallbackInfo<Value> &args) {
}
static class_struct* ClassBase::getExportStruct() {
    return 0;
}
ClassType ClassBase::getClassType() {
    return CLASS_NULL;
}
