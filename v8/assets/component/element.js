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
Element.prototype.ElementTypeElement = 1;
Element.prototype.ElementTypeNode = 1 << 1;
Element.prototype.ElementTypeContainer = 1 << 2;
Element.prototype.ElementTypeUIContainer = 1 << 3;
Element.prototype.ElementTypeScene = 1 << 4;
Element.prototype.__elementType = Element.prototype.ElementTypeElement;
Element.prototype.isElementType = function (type) {
    return (this.__elementType & type) > 0;
}

module.exports = Element;
