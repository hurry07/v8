(function () {
    print(11);
    this.gc1 = new gcobserver('gc1');
    this.gc2 = new gcobserver('gc2');
    this.testFn = function () {
        print('in testFn');
        print(this.gc1);
        print(this.gc2);
    }
    this.removeRef = function () {
        delete this.gc1;
        delete this.gc2;
    }
    this.forceGc = function () {
        var count = 0;
        while (count++ < 100000) {
            new gcobserver();
        }
    }
});
