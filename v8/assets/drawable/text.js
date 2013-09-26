var _gl = require('opengl');
var _MeshNode = require('drawable/meshnode.js');
var _createMesh = require('glcore/meshbuffer.js').createMesh;
var _inherit = require('core/inherit.js');

function Text(material, font) {
    _MeshNode.call(this, null, material);

    this.font = font;
    this.mText = '';
    this.mVisiable = false;
    this.setSize(0, font.height);
}
_inherit(Text, _MeshNode);
Text.prototype.setText = function (text) {
    if (text != this.mText) {
        this.mText = text;
        if (!this.mText || this.mText.length == 0) {
            this.mVisiable = false;
        } else {
            this.mVisiable = true;
            this.createMesh();
        }
    }
}
Text.prototype.createMesh = function () {
    var len = this.mText.length;
    var b = this.mBuffer = _createMesh('p2t2', len * 6, _gl.TRIANGLES);
    console.log(b.length);
    var element = new Float32Array(b.adapter().buffer());
    var width = 0;
    var height = this.font.height;

    var twidths = new Float32Array(len * 2);
    var glyphs = new Float32Array(len * 8);
    var x = 0;
    var y = -this.font.ascender;
    this.font.load(this.mText);
    this.font.measure(this.mText, twidths);// [advance,kerning]
    this.font.glyphs(this.mText, glyphs);// [offsetx,offsety,width,height,s0,t0,s1,t1]

    var gindex = 0;
    var windex = 0;
    var pindex = 0;
    var x0, y0, x1, y1, s0, t0, s1, t1;
    for (var i = 0; i < len; i++) {
        x += twidths[windex + 1];

        x0 = x + glyphs[gindex];
        y0 = y + glyphs[gindex + 1];
        x1 = x0 + glyphs[gindex + 2];
        y1 = y0 - glyphs[gindex + 3];
        s0 = glyphs[gindex + 4];
        t0 = glyphs[gindex + 5];
        s1 = glyphs[gindex + 6];
        t1 = glyphs[gindex + 7];

        element.set([x0, y0, s0, t0]);
        b.push(pindex);
        element.set([x0, y1, s0, t1]);
        b.push(pindex + 1);
        element.set([x1, y0, s1, t0]);
        b.push(pindex + 2);
        b.copy(pindex + 2, pindex + 3, 1);
        b.copy(pindex + 1, pindex + 4, 1);
        element.set([x1, y1, s1, t1]);
        b.push(pindex + 5);

        gindex += 8;
        windex += 2;
        pindex += 6;

        x += twidths[windex];
    }

//    console.log('pindex', b.buffer());
    console.log('pindex', Array.prototype.join.call(new Float32Array(b.buffer().buffer), ','));
    console.log('pindex', pindex, len);
    this.setSize(x, height);
    this.setCenter(0, height);

    b.upload();
}
Text.prototype.draw = function (context) {
    if (!this.mVisiable) {
        return;
    }
    console.log('Text.prototype.draw');
    this.updateMatrix();
    context.render(this, this.mBuffer, this.mMaterial);
}

module.exports = Text;