function iterator(coll, root, textures) {
    for (var i in coll) {
        if (typeof coll[i] === 'object') {
            iterator(coll[i], root + '/' + i, textures);
        } else {
            textures.push(root + '/' + i + coll[i]);
            coll[i] = textures.length - 1;
        }
    }
}
var R = {
    game: {
        bg: '.png',
        block_big: '.png',
        block_small: '.png',
        block_column: '.png'
    },
    ui: {
        add: '.png',
        auto: '.png',
        column: '.png',
        counter: '.png',
        minus: '.png',
        ok: '.png',
        points_bg: '.png',
        slide: '.png'
    },
    pngnow: '.png',
    test: '.png',
    word: '.png'
}

var textures = [];
var root = 'images';
iterator(R, '', textures);

// managing texture frame creation
var _textures = require('glcore/textures.js');
var _frame = require('render/textureframe.js');

function getPath(id) {
    return root + textures[id];
}
function createFrame(id) {
    var path = getPath(id);
    if (path.frame) {
        return path.frame;
    }
    var t = _textures.createTexture2D(path);
    return path.frame = new _frame(t);
}

exports.R = R;
exports.createFrame = createFrame;