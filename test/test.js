if (typeof window === 'undefined') {
    var Arnold = require('../index.js');
    var chai   = require('chai');
}

function A() {}
A.prototype.runFib = function(n)
{
    var i, t, a = 0, b = 1;
    for (i = 0; i < n; i++) {
        t = a + b;
        a = b;
        b = t;
    }
    return a;
};
A.prototype.run = function(max)
{
    var s, diff = 0.0;
    s = arnold.now();
    while(diff < max) {
        this.runFib(100);
        diff = arnold.now() - s;
    }
};

var expect, arnold;

// ----------------------
describe("Inject", function() {
    expect = chai.expect;
    arnold = Arnold();
    this.timeout(15*1000);

    describe("Basic", function() {
        it( "Time", function(done) {

            var maxTime   = 1000;
            var errorTime = maxTime/10;
            var a = new A();
            a = arnold.inject(a, "A");

            a.run(maxTime);

            stats = arnold.getInjectionStats();
            var totalTime = stats.A.run.diff;
            //console.log("stats:", stats);

            totalTime = Math.floor(totalTime);
            if( totalTime > maxTime - errorTime &&
                totalTime < maxTime + errorTime ) {
                totalTime = maxTime;
            }

            expect( totalTime ).is.equal( maxTime );
            done();
        });
    });
});
