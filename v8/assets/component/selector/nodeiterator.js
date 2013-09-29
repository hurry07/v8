// ==========================
// Node Iterator
// ==========================
function NodeListener() {
}
NodeListener.prototype.onNode = function (cssnode) {
    console.log(cssnode.node);
}

// ==========================
// Node Iterator
// ==========================
function NodeIterator() {
    this.status = 0;// 0 return curent point, 1 find child, if any
    this.nodes = 0;
    this.reached = 0;
    this.stack = [];
}
NodeIterator.prototype.init = function (cssroot) {
    this.status = 0;
    this.nodes = 1;
    this.reached = 0;
    this.stack = [cssroot];
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
NodeIterator.prototype.nodeFirst = function (listener) {
    while (this.hasNext()) {
        var n = this.peek();

        switch (this.status) {
            case 0:
                this.reached++;
                listener.onNode(n);
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
                this.pop();
                break;
        }
    }
}
NodeIterator.prototype.childFirst = function (listener) {
    while (this.hasNext()) {
        var n = this.peek();

        switch (this.status) {
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
                listener.onNode(this.pop());
                this.reached++;
                break;
        }
    }
}

module.exports = NodeIterator;
