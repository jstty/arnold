var Arnold = require("../../../lib/arnold.js");
var LogZ = require("logz-js");
var logz = LogZ();
// ------------------------

// My Class
function Wimp() {
}

Wimp.prototype.runFib = function(n)
{
    var i, t, a = 0, b = 1;
    for (i = 0; i < n; i++) {
        t = a + b;
        a = b;
        b = t;
    }
    return a;
};
// ------------------------

var stats;
var arnold = Arnold({
    verbose: true
});

// inject arnold into wimp class
var w = new Wimp();
w = arnold.inject(w, "Wimp");
// ------------------------

w.runFib(100);
w.runFib(100);

// ------------------------
stats = arnold.getInjectionStats();
logz.log(JSON.stringify(stats, null, 2));
logz.log("------------------------");
// ------------------------

w.runFib(100);

// ------------------------
stats = arnold.getInjectionStats();
logz.log("------------------------");
logz.log(JSON.stringify(stats, null, 2));
