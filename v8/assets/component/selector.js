var _Parser = require('component/selector/parser.js');
var _CSSNode = require('component/selector/cssnode.js');
var _NodeIterator = require('component/selector/nodeiterator.js');
var _listener = require('component/selector/nodelistener.js');
var _SelectorListener = _listener.SelecterListener;

var _selector = require('component/selector/selector.js');
var _SelectorGroup = _selector.SelectorGroup;

function querySelector(node, query) {
    console.log('001');
    var selectors = new _Parser().parse(query);
    console.log('002');
    if (selectors.length == 0) {
        return [];
    }

    console.log('003');
    var root = _CSSNode.wrap(node);
    console.log('004');
    var itor = new _NodeIterator();
    var listener = new _SelectorListener().reset(new _SelectorGroup(selectors));
    console.log('005');
    itor.childFirst(root, listener);
    console.log('006');

    return listener.targets;
}

exports.querySelector = querySelector;