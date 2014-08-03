# Arnold 
Beef up your JS functions, by doing some Benchmarks!

[![Build Status](https://secure.travis-ci.org/jstty/arnold.png)](http://travis-ci.org/jstty/arnold) [![Dependency Status](https://david-dm.org/jstty/arnold.png?theme=shields.io)](https://david-dm.org/jstty/arnold) [![devDependency Status](https://david-dm.org/jstty/arnold/dev-status.png?theme=shields.io)](https://david-dm.org/jstty/arnold#info=devDependencies) [![NPM](https://nodei.co/npm/arnold-js.png)](https://nodei.co/npm/arnold-js/)


## NPM
```sh
$ npm install arnold-js
```

## Bower
```sh
$ bower install arnold
```

## Usage

### Basic
```js
var Arnold = require("../../../lib/arnold.js");
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
console.log(JSON.stringify(stats, null, 2));
console.log("------------------------");
// ------------------------

w.runFib(100);

// ------------------------
stats = arnold.getInjectionStats();
console.log("------------------------");
console.log(JSON.stringify(stats, null, 2));
```
