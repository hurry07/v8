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
    return '{type selector:' + this.type + '}';
}

// ==========================
// PseudoSelector :focus
// ==========================
function PseudoSelector(matcher, pseudo) {
    this.matcher = matcher;
    this.pseudo = pseudo;
}
PseudoSelector.prototype.setPseudo = function (pseudo) {
    this.pseudo = pseudo;
}
PseudoSelector.prototype.matchProp = function () {
    return true;
}
PseudoSelector.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
}

// ==========================
// AttributeSelector []
// ==========================
function AttributeSelector(matcher) {
    this.matcher = matcher;
    this.attrs = [];
}
AttributeSelector.prototype.matchProp = function () {
    return true;
}
AttributeSelector.prototype.addAttribute = function (attr) {
    console.log(attr);
}
AttributeSelector.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
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
function ClassSelector(matcher, pclass) {
    this.matcher = matcher;
    this.mClass = pclass;
}
ClassSelector.prototype.setClass = function (clz) {
    this.mClass = clz;
}
ClassSelector.prototype.matchProp = function (node) {
    return true;
}
ClassSelector.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
}

// ==========================
// IdSelector
// ==========================
function IdSelector(matcher, id) {
    this.matcher = matcher;
    this.id = id;
}
IdSelector.prototype.setId = function (id) {
    this.id = id;
}
IdSelector.prototype.matchProp = function (node) {
    return true;
}
IdSelector.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
}

exports.Selector = Selector;
exports.IdSelector = IdSelector;
exports.ClassSelector = ClassSelector;
exports.ChildSelector = ChildSelector;
exports.PseudoSelector = PseudoSelector;
exports.TypeSelector = TypeSelector;
exports.AttributeSelector = AttributeSelector;
exports.Adjacentselectors = Adjacentselectors;
