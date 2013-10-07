var _Parser = require('component/selector/parser.js');
var _CSSNode = require('component/selector/cssnode.js');
var _NodeIterator = require('component/selector/nodeiterator.js');
var _listener = require('component/selector/nodelistener.js');
var _SelectorListener = _listener.SelecterListener;

var _selector = require('component/selector/selector.js');
var _SelectorGroup = _selector.SelectorGroup;

function querySelector(node, query) {
    var selectors = new _Parser().parse(query);
    if (selectors.length == 0) {
        return [];
    }

    var root = _CSSNode.wrap(node);
    root.print();
    var itor = new _NodeIterator();
    var listener = new _SelectorListener().reset(new _SelectorGroup(selectors));
    itor.childFirst(root, listener);

    return listener.targets;
}

exports.querySelector = querySelector;