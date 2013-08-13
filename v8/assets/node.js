(function (process) {
    var global = this;

    function startup() {
        startup.globalExtend();
        startup.globalRequire();
        startup.globalConsole();
    }

    startup.globalExtend = function() {
        function _extends(sub, super_, props) {
            sub.prototype = Object.create(super_.prototype);
            if (props) {
                for (var i in props) {
                    sub.prototype[i] = props[i];
                }
            }
            sub.prototype.constructor = sub;
            return sub;
        }
        global.__defineGetter__('_extends', function () {
            return _extends;
        });
    }
    startup.globalRequire = function () {
        global.__defineGetter__('require', function () {
            return NativeModule.require;
        });
    }
    startup.globalConsole = function () {
        global.__defineGetter__('console', function () {
            return NativeModule.require('console');
        });
    };
    startup.globalExtend = function() {

    }

    /**
     * 表示预先定义的 js 模块
     *
     * @param id
     * @constructor
     */
    function NativeModule(id) {
        this.filename = id;
        this.id = id;
        this.exports = {};
        this.loaded = false;
    }

    NativeModule._cache = {};

    /**
     * 请求一个模块
     *
     * @param id
     * @returns {*}
     */
    NativeModule.require = function (id) {
        if (id == 'native_module') {
            return NativeModule;
        }

        var cached = NativeModule.getCached(id);
        if (cached) {
            return cached.exports;
        }

        var nativeModule = new NativeModule(id);
        nativeModule.cache();
        nativeModule.compile();

        return nativeModule.exports;
    };

    NativeModule.getCached = function (id) {
        return NativeModule._cache[id];
    }

    /**
     * 把代码包装成一个函数, 这样能够代理到对象的执行
     * @param script
     * @returns {*}
     */
    NativeModule.wrap = function (script) {
        return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
    };

    NativeModule.prototype.compile = function () {
        var fn = process.binding(this.id);
        this.testname = 'jack';
        fn.call(this, this.exports, NativeModule.require, this, this.filename);
        this.loaded = true;
    };

    NativeModule.prototype.cache = function () {
        NativeModule._cache[this.id] = this;
    };

    startup();
});
