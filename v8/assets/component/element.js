var mElementId = 0;

function generatorId() {
    return mElementId++;
}

/**
 * like HtmlElement
 * @constructor
 */
function Element() {
    this.mId = generatorId();// give an auto increase id
    this.mClass = '';// an aulter describe, like css
    this.mParent = null;
}
Element.prototype.mTag = 'element';// describe current type(class)
Element.prototype.setId = function (id) {
    this.mId = id;
    return this;
};
Element.prototype.getId = function () {
    return  this.mId;
};
Element.prototype.generatorId = generatorId;
Element.prototype.layoutToRelativ = function (rx, ry, element, rx, ry, offsetx, offsety) {
}

module.exports = Element;
