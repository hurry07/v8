function Matcher() {
}
Matcher.prototype.match = function (node) {
    return true;
}

function TypeMatcher(type) {
    this.type = type;
}
TypeMatcher.prototype.match = function (node) {
    return node.type == this.type;
}

exports.TypeMatcher = TypeMatcher;
exports.Matcher = Matcher;

