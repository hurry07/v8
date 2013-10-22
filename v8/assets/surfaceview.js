function SurfaceView() {
    this.impl = null;
}
SurfaceView.prototype.onSurfaceCreated = function (width, height) {
    var impl = this.impl;
    if (impl) {
        impl.onSurfaceCreated(width, height);
    }
};
SurfaceView.prototype.onSurfaceChanged = function (width, height) {
    var impl = this.impl;
    if (impl) {
        impl.onSurfaceChanged(width, height);
    }
};
SurfaceView.prototype.onDrawFrame = function () {
    var impl = this.impl;
    if (impl) {
        impl.onDrawFrame();
    }
};
SurfaceView.prototype.release = function () {
    this.impl = null;
};
SurfaceView.prototype.bind = function (impl) {
    this.impl = impl;
};

module.exports = new SurfaceView();