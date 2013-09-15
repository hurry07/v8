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

var _types = {
    ElementTypeElement: 1,
    ElementTypeNode: 1 << 1,
    ElementTypeContainer: 1 << 2,
    ElementTypeUIContainer: 1 << 3,
    ElementTypeScene: 1 << 4
}
for (var i in _types) {
    Element.prototype[i] = _types[i];
}
Element.prototype.__elementType = Element.prototype.ElementTypeElement;
Element.prototype.isElementType = function (type) {
    return (this.__elementType & type) > 0;
}
Element.prototype.isUIElement = function () {
    return (this.__elementType & _types.ElementTypeUIContainer) > 0;
}
Element.prototype.containsAll = function (type) {
    var basetype = -1;
    for (var i = -1, arr = Array.prototype.slice.call(arguments, 1), l = arr.length; ++i < l;) {
        basetype &= arr[i];
    }
    return (basetype & type) > 0;
}
Element.prototype.containsAny = function (type) {
    var basetype = 0;
    for (var i = -1, arr = Array.prototype.slice.call(arguments, 1), l = arr.length; ++i < l;) {
        basetype |= arr[i];
        if ((basetype & type) > 0) {
            return true;
        }
    }
    return false;
}

module.exports = Element;
