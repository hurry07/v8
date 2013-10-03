// ==========================
// Selector SuperClass
// ==========================
function Selector(depth) {
    this.depth = depth || 0;
}
Selector.prototype.match = function (node) {
    return true;
}

// ==========================
// GroupSelector
// ==========================
function GroupSelector() {
    this.matches = Array.prototype.slice.call(arguments, 0);
}
GroupSelector.prototype.match = function (node) {
    for (var i = -1, coll = this.matches, l = coll.length; ++i < l;) {
        if (!coll[i].match(node)) {
            return false;
        }
    }
    return true;
}

// ==========================
// TypeSelector * div
// ==========================
function TypeSelector(type) {
    this.type = type;
    if (type == '*') {
        this.any = true;
    }
}
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
    this.selector = selector;
    this.pseudo = pseudo;
}
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
    this.selector = selector;
    this.attrs = [];
}
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
    this.selector = selector;
}
Adjacentselectors.prototype.matchProp = function () {
    return true;
}
Adjacentselectors.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
Adjacentselectors.prototype.toString = function () {
    return this.selector + '+';
}

// ==========================
// ChildSelector E > F
// ==========================
function ChildSelector(selector) {
    this.selector = selector;
}
ChildSelector.prototype.matchProp = function (node) {
    return true;
}
ChildSelector.prototype.match = function (node) {
    return this.selector.match(node) && this.matchProp(node);
}
ChildSelector.prototype.toString = function () {
    return this.selector + '>';
}

// ==========================
// ChildSelector
// ==========================
function ClassSelector(selector, pclass) {
    this.selector = selector;
    this.mClass = pclass;
}
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
    this.selector = selector;
    this.id = id;
}
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

exports.Selector = Selector;
exports.IdSelector = IdSelector;
exports.ClassSelector = ClassSelector;
exports.ChildSelector = ChildSelector;
exports.PseudoSelector = PseudoSelector;
exports.TypeSelector = TypeSelector;
exports.AttributeSelector = AttributeSelector;
exports.Adjacentselectors = Adjacentselectors;
