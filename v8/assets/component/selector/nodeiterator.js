var _LinkedList = require('component/selector/linkednode.js');

/**
 * wrap of ui element
 * @param node
 * @param parent
 * @constructor
 */
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

function NodeIterator() {
    this.status = 0;// 0 return curent point, 1 find child, if any
    this.nodes = 0;
    this.reached = 0;
    this.stack = [];
    this.implement = this.__nodeFirst;
}
NodeIterator.prototype.nodeFirst = function () {
    this.implement = this.__nodeFirst;
    return this;
}
NodeIterator.prototype.childFirst = function () {
    this.implement = this.__childFirst;
    return this;
}
NodeIterator.prototype.init = function (root) {
    this.status = 0;
    this.nodes = 1;
    this.reached = 0;
    this.stack = [root];
    return this;
}
NodeIterator.prototype.push = function (node) {
    this.stack.push(node);
}
NodeIterator.prototype.pop = function () {
    return this.stack.pop()
}
NodeIterator.prototype.peek = function () {
    return this.stack[this.stack.length - 1];
}
NodeIterator.prototype.hasNext = function () {
    return this.nodes > this.reached;
}
NodeIterator.prototype.next = function () {
    return this.implement();
}
NodeIterator.prototype.__nodeFirst = function () {
    while (this.nodes > this.reached) {
        var n = this.peek();
        switch (this.status) {
            case 0:
                n.children.startItor();
                this.nodes += n.children.count();
                this.status = 1;
                this.reached++;
                return n;

            case 1:
                if (n.children.hasNext()) {
                    this.push(n.children.next());
                    this.status = 0;
                    continue;
                }
                this.pop();
                break;
        }
    }
}
NodeIterator.prototype.__childFirst = function () {
    while (this.nodes > this.reached) {
        var n = this.peek();
        switch (status) {
            case 0:
                n.children.startItor();
                this.nodes += n.children.count();
                this.status = 1;
                break;

            case 1:
                if (n.children.hasNext()) {
                    this.push(n.children.next());
                    this.status = 0;
                    continue;
                }
                this.reached++;
                return this.pop();
        }
    }
}

function Iterator(node) {
    this.root = new CSSNode(node, null);
    this.initChildren(this.root);
}
Iterator.prototype.onNode = function (node) {
    console.log(node);
}
Iterator.prototype.iterator = function (root) {
    var status = 0;// 0 return curent point, 1 find child, if any
    var nodes = 1;
    var reached = 0;
    var stack = [this.root];

    while (nodes > reached) {
        var n = stack[stack.length - 1];

        switch (status) {
            case 0:
                reached++;
                this.onNode(n.node);
                n.children.startItor();
                nodes += n.children.count();
                status = 1;
                break;

            case 1:
                if (n.children.hasNext()) {
                    stack.push(n.children.next());
                    status = 0;
                    continue;
                }
                stack.pop();
                break;
        }
    }
}
Iterator.prototype.iterator1 = function (root) {
    var status = 0;// 0 return curent point, 1 find child, if any
    var nodes = 1;
    var reached = 0;
    var stack = [this.root];

    while (nodes > reached) {
        var n = stack[stack.length - 1];

        switch (status) {
            case 0:
                n.children.startItor();
                nodes += n.children.count();
                status = 1;
                break;

            case 1:
                if (n.children.hasNext()) {
                    stack.push(n.children.next());
                    status = 0;
                    continue;
                }
                this.onNode(stack.pop().node);
                reached++;
                break;
        }
    }
}
Iterator.prototype.initChildren = function (root) {
    var task = [root];
    while (task.length > 0) {
        var cssnode = task.pop();
        var children = cssnode.node.children;
        if (!children || children.length == 0) {
            continue;
        } else {
            for (var i = -1, l = children.length; ++i < l;) {
                var child = new CSSNode(children[i], cssnode);
                task.push(child);
                cssnode.children.addNode(child);
            }
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
