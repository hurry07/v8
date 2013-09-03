var frameDB = {};

/**
 * @param texture ref
 * @param w width of picture
 * @param h height
 * @param ox offsetx, current picture x to the underlying texture x(0)
 * @param oy offsety
 * @param vx visiable x in picture rectangle
 * @param vy
 * @param vw visiable area width
 * @param vh
 */
function textureFrame(texture, w, h, ox, oy, vx, vy, vw, vh) {
    this.texture = texture;
    if(arguments.length == 3) {
        this.ox = this.oy = 0;
        this.vx = this.vy = 0;
        this.w = this.vw = w;
        this.h = this.vh = h;
    } else {
        this.w = w;
        this.h = h;
        this.ox = ox;
        this.oy = oy;
        this.vx = vx;
        this.vy = vy;
    }
}
