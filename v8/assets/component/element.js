var mElementCount = 0;

/**
 * like HtmlElement
 * @constructor
 */
function Element() {
    this.mId = mElementCount++;// give an auto increase id
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

module.exports = Element;