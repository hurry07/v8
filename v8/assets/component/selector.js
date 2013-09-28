// ==========================
// selector matching temp status
// ==========================
function MatchSequence(element) {
    this.matches = [];// match depth
    this.depth = 0;
    this.element = element;
}
MatchSequence.prototype.match = function () {
    this.matches.push(this.depth++);
}
MatchSequence.prototype.next = function () {
    this.depth++;
}
/**
 * @param node
 * @param previous may be parent* of current node
 * @constructor
 */
function MatchNode(node, previous) {
    this.node = node;
    this.previous = previous;
}

// ==========================
// list of selector running
// ==========================
function SelectorSequence() {
    this.selector = [];
}

// ==========================
// selector types
// ==========================
function StateSelector(success) {
    this.success = success;
}
StateSelector.prototype.test = function (element, tasks) {
    return this.success;
}

function ElementSelector(type) {
    this.type = type;
    this.wildBegin = false;
    this.wildEnd = false;
}
ElementSelector.prototype.getReady = function (index, length) {
    if (type == -1) {
        if (index == 0) {
            this.wildBegin = true;
        }
        if (index == length - 1) {
            this.wildEnd = true;
        }
    }
}
ElementSelector.prototype.match = function (element) {
}

// ==========================
// selector format transform
// ==========================
function StringBuffer(content) {
    this.content = content;
    this.cursor = 0;
    this.length = content.length;
    this.token = -1;
}
StringBuffer.prototype.readtill = function (tokens) {
    var p = this.cursor;
    var l = this.length;
    var c = this.content;
    while (p < l) {
        if (tokens.indexOf(this.token = c.charAt(p)) != -1) {
            var s = c.slice(this.cursor, p);
            p = this.cursor;
            return s;
        }
        p++;
    }

    this.token = '';
    p = this.cursor;
    this.cursor = this.length;
    return c.slice(p);
}
StringBuffer.prototype.skip = function () {
    this.cursor++;
}
StringBuffer.prototype.isEmpty = function () {
    this.cursor == this.length;
}
StringBuffer.prototype.rollback = function (length) {
    this.cursor -= length || 1;
}

function Parser() {
    this.selector = [];
}
Parser.prototype.parse = function (format) {
    var buffer = new StringBuffer(format);
    var any = new AnyParser();
    while (buffer.isEmpty()) {
    }
}
