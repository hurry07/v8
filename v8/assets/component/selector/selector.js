var _inherit = require('core/inherit.js');

// ==========================
// Selector SuperClass
// ==========================
function Selector() {
    this.index = 0;
    this.group = null;
    this.type = ' ';
}
Selector.prototype.match = function (cssnode) {
    return false;
}
/**
 * next element is exactly after current element
 * @returns {boolean}
 */
Selector.prototype.isTight = function () {
    return false;
}
Selector.prototype.getMatchOffset = function () {
    return this.group.end - this.index - 1;
}

// ==========================
// TypeSelector * | div | image
// ==========================
function TypeSelector(type) {
    Selector.call(this);
    this.type = type;
    if (type == '*') {
        this.any = true;
    }
}
_inherit(TypeSelector, Selector);
TypeSelector.prototype.match = function (node) {
    return this.any || node.type == this.type;
}
TypeSelector.prototype.toString = function () {
    return '{type:' + this.type + '}';
}

// ==========================
// PseudoSelector :focus
// ==========================
function PseudoSelector(selector, pseudo) {
    Selector.call(this);
    this.selector = selector;
    this.pseudo = pseudo;
}
_inherit(PseudoSelector, Selector);
PseudoSelector.prototype.setPseudo = function (pseudo) {
    this.pseudo = pseudo;
}
PseudoSelector.prototype.matchProp = function () {
    return true;
}
PseudoSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
PseudoSelector.prototype.toString = function () {
    return this.selector + ':' + this.pseudo;
}

// ==========================
// AttributeSelector []
// ==========================
function AttributeSelector(selector) {
    Selector.call(this);
    this.selector = selector;
    this.attrs = [];
}
_inherit(AttributeSelector, Selector);
AttributeSelector.prototype.matchProp = function () {
    return true;
}
AttributeSelector.prototype.addAttribute = function (attr) {
    this.attrs.push(attr);
}
AttributeSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
AttributeSelector.prototype.toString = function () {
    var str = this.selector.toString();
    for (var i = -1, attrs = this.attrs, l = attrs.length; ++i < l;) {
        str += '[' + attrs[i] + ']';
    }
    return str;
}

// ==========================
// Adjacentselectors E + F
// ==========================
function Adjacentselectors(selector) {
    Selector.call(this);
    this.selector = selector;
}
_inherit(Adjacentselectors, Selector);
Adjacentselectors.prototype.matchProp = function () {
    return true;
}
Adjacentselectors.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
Adjacentselectors.prototype.toString = function () {
    return this.selector + '+';
}
Adjacentselectors.prototype.isTight = function () {
    return true;
}

// ==========================
// ChildSelector E > F
// ==========================
function ChildSelector(selector) {
    Selector.call(this);
    this.selector = selector;
}
_inherit(ChildSelector, Selector);
ChildSelector.prototype.matchProp = function (node) {
    return true;
}
ChildSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
ChildSelector.prototype.toString = function () {
    return this.selector + '>';
}
ChildSelector.prototype.isTight = function () {
    return true;
}

// ==========================
// ChildSelector
// ==========================
function ClassSelector(selector, pclass) {
    Selector.call(this);
    this.selector = selector;
    this.mClass = pclass;
}
_inherit(ClassSelector, Selector);
ClassSelector.prototype.setClass = function (clz) {
    this.mClass = clz;
}
ClassSelector.prototype.matchProp = function (node) {
    return true;
}
ClassSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
ClassSelector.prototype.toString = function () {
    return this.selector + '.' + this.mClass;
}

// ==========================
// IdSelector
// ==========================
function IdSelector(selector, id) {
    Selector.call(this);
    this.selector = selector;
    this.id = id;
}
_inherit(IdSelector, Selector);
IdSelector.prototype.setId = function (id) {
    this.id = id;
}
IdSelector.prototype.matchProp = function (node) {
    return true;
}
IdSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
IdSelector.prototype.toString = function () {
    return this.selector + '#' + this.id;
}

// ==========================
// GroupSelector
// ==========================
function Group(start) {
    this.start = start;
    this.end = start + 1;
}

function SelectorGroup(selectors) {
    this.selectors = selectors;

    var group = new Group(0);
    for (var i = 0, coll = this.selectors, l = coll.length; i < l; i++) {
        var sel = coll[i];
        sel.group = group;
        sel.index = i;
        if (!sel.isTight()) {
            group.end = i + 1;
            if (i < l - 1) {
                group = new Group(group.end);
            }
        }
    }
}
SelectorGroup.prototype.match = function (path) {
    var sels = this.selectors;
    console.log('SelectorGroup.prototype.match', sels);
    var sindex = sels.length - 1;
    var nindex = path.length - 1;
    var success = true;

    while (sindex > -1 && nindex > -1) {
        if (sels[sindex].match(path[nindex].node)) {
            sindex--;
        } else {
            if (nindex == path.length - 1) {
                success = false;
                break;
            }
            var offset = sels[sindex].getMatchOffset();
            nindex += offset - 1;
            sindex += offset;
        }
    }
    console.log('match', path[path.length - 1].node, success);
    return success;
}

exports.Selector = Selector;
exports.IdSelector = IdSelector;
exports.ClassSelector = ClassSelector;
exports.ChildSelector = ChildSelector;
exports.PseudoSelector = PseudoSelector;
exports.TypeSelector = TypeSelector;
exports.AttributeSelector = AttributeSelector;
exports.Adjacentselectors = Adjacentselectors;

exports.SelectorGroup = SelectorGroup;
