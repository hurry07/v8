var _LinkedList = require('component/selector/linkednode.js');

function CSSNode(node, parent) {
    this.depth = 0;
    this.children = new _LinkedList();
    this.init(node, parent);
}
CSSNode.prototype.init = function (node, parent) {
    this.node = node;
    this.parent = parent;
    this.children.clear();
    this.previous = this.next = null;
    if (parent) {
        this.depth = parent.depth + 1;
    } else {
        this.depth = 0;
    }
}

function StackNode(cssnode) {
    this.cssnode = cssnode;
    this.cursor = 0;
}

function Iterator(node) {
    this.root = new CSSNode(node, null);
    this.initChildren(this.root);
}
Iterator.prototype.initChildren = function (root) {
    var stack = [new StackNode(root)];
    while (stack.length > 0) {
        var stacknode = stack[stack.length - 1];
        var cssnode = stacknode.cssnode;
        var children = cssnode.node.children;
        if (!children || children.length <= stacknode.cursor) {
            stack.pop();
        } else {
            for (var i = -1, l = children.length; ++i < l;) {
                var child = new CSSNode(children[i], cssnode);
                stack.push(new StackNode(child));
                cssnode.children.addNode(child);
            }
            stacknode.cursor += children.length;
        }
    }
}
Iterator.prototype.printRoot = function () {
    this.printStructure(this.root, 0);
}
Iterator.prototype.printStructure = function (root, depth) {
    var prefix = '';
    var empty = '    ';
    depth = depth || 0;
    for (var i = 0; i < depth; i++) {
        prefix += empty;
    }

    if (root.children.isEmpty()) {
        console.log(prefix + root.node + ':{}');
    } else {
        console.log(prefix + root.node + ':[');
        var itor = root.children.startItor();
        while (itor.hasNext()) {
            this.printStructure(itor.next(), depth + 1);
        }
        console.log(prefix + ']');
    }
}

module.exports = Iterator;
