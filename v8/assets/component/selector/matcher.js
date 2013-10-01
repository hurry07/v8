// ==========================
// Matcher SuperClass
// ==========================
function Matcher(depth) {
    this.depth = depth || 0;
}
Matcher.prototype.match = function (node) {
    return true;
}

// ==========================
// GroupMatcher
// ==========================
function GroupMatcher() {
    this.matches = Array.prototype.slice.call(arguments, 0);
}
GroupMatcher.prototype.match = function (node) {
    for (var i = -1, coll = this.matches, l = coll.length; ++i < l;) {
        if (!coll[i].match(node)) {
            return false;
        }
    }
    return true;
}

// ==========================
// TypeMatcher
// ==========================
function TypeMatcher(type) {
    this.type = type;
    if (type == '*') {
        this.any = true;
    }
}
TypeMatcher.prototype.match = function (node) {
    return this.any || node.type == this.type;
}

// ==========================
// PropertyMatcher
// ==========================
function PropertyMatcher(matcher, prop) {
    this.matcher = matcher;
    this.prop = prop;
}
PropertyMatcher.prototype.matchProp = function (node) {
    return true;
}
PropertyMatcher.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
}

// ==========================
// ParentMatcher
// ==========================
function ParentMatcher(matcher, prop) {
    this.matcher = matcher;
    this.prop = prop;
}
ParentMatcher.prototype.matchProp = function (node) {
    return true;
}
ParentMatcher.prototype.match = function (node) {
    return this.matcher.match(node) && this.matchProp(node);
}

exports.TypeMatcher = TypeMatcher;
exports.Matcher = Matcher;

