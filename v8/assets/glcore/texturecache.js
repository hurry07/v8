var _weak = require('core/weak.js');
var _textures = require('glcore/textures.js');
var _frame = require('glcore/textureframe.js');

function iterator(coll, root, textures) {
    for (var i in coll) {
        if (typeof coll[i] === 'object') {
            iterator(coll[i], root + '/' + i, textures);
        } else {
            coll[i] = textures.createTexture(root + '/' + i + coll[i]);
        }
    }
}

// ==========================
// WeakTexture
// ==========================
function WeakTexture(path) {
    this.path = path;
    this.weakFrame = null;
}
WeakTexture.prototype.createFrame = function () {
    var f = this.weakFrame && this.weakFrame.get();
    if (!f) {
        var t = _textures.createTexture2D(this.path);
        this.weakFrame = _weak.create(f = new _frame(t));
    }
    return f;
};

// ==========================
// TextureCache
// ==========================
function TextureCache(root, R) {
    this.root = root;
    this.R = R;
    this.cache = [];
    iterator(R, '', this);
}
/**
 * @param path image relative path
 * @returns {Number}
 */
TextureCache.prototype.createTexture = function (path) {
    var id = this.cache.length;
    this.cache.push(new WeakTexture(this.root + path));
    return id;
};
TextureCache.prototype.createFrame = function (id) {
    return this.cache[id].createFrame();
};

exports.create = function (root, R) {
    return new TextureCache(root, R);
};
