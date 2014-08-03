/* -------------------------- */
/*
 * Unify browser and node
 */
var performance;
if(typeof(window) === 'undefined') {
    // NodeJS
    var LogZ    = require('logz-js');
    var _       = require('lodash');

    // poly fill for performance
    perf = {
        now: function() {
            var t = process.hrtime();
            return t[0] * 1e3 + t[1] / 1e6;
        },
        memory: function(){
            return process.memoryUsage();
        }
    };
} else {
    // Browser
    if(typeof(_) === 'undefined') {
        _ = null;
    }

    if(typeof(LogZ) === 'undefined') {
        LogZ = null;
    }

    perf = {
        now:    function() {
            return window.performance.now();
        },
        memory: function(){
            return window.performance.memory;
        }
    };
}
/* -------------------------- */


(function(_, LogZ, perf){

    // check for dependencies
    if(!LogZ) {
        logz = console;
    } else {
        logz = LogZ("Arnold");
    }

    if(!_) {
        console.log("Arnold needs underscore/lodash!");
        return;
    }

    if(!perf) {
        console.log("Arnold needs performance!");
        return;
    }

    // Unify browser and node
    if(typeof(window) === 'undefined') {
        module.exports = Arnold;
    } else {
        window.Arnold  = Arnold;
    }
    /* -------------------------- */

     /*
     * Arnold class
     */
    function Arnold(options) {
        // if called a function then return an instance
        if (!(this instanceof Arnold)) {
            return new Arnold(options);
        }

        // default
        this.options = _.merge({
            verbose: false
        }, options);

        this.injector = new Injector(this.options);
        this.profiler = new Profiler(this.options);
    }

    Arnold.prototype.inject = function(obj, key)
    {
        return this.injector.inject(obj, key);
    };

    Arnold.prototype.getInjectionStats = function()
    {
        return this.injector.getStats();
    };

    Arnold.prototype.profile = function(options)
    {
        return this.profiler.run(options);
    };

    Arnold.prototype.now = function()
    {
        return perf.now();
    };


    /*
     * Injector class
     */
    Injector = function(options)
    {
       this.injections = 0;
       this.tree = { "parent": null, "name":"root", "totalDiff":0, "totalMemory":{} };

       // default
       this.options = _.merge({
           verbose: false
       }, options);
    };

    Injector.prototype.displayTree = function()
    {
        logz.log("tree:", this.getStats());
    };

    Injector.prototype.getStats = function()
    {
        return this._r_treeCopy(this.tree);
    };

    Injector.prototype.inject = function(obj, key)
    {
        if(!key) {
            key = "Object"+ (this.injections);
        }

        this.injections++;
        this.tree[key] = { "parent": this.tree, "name":key, "totalDiff":0, "totalMemory":{} }
        var nobj = this._r_inject(new Object(), obj, this.tree[key], key);

        return nobj;
    };


    /*
     * Internal Functions
     */
    // recursive copy source tree removing parent objects
    Injector.prototype._r_treeCopy = function(stree)
    {
        var otree = {};
        for(var i in stree) {
            if(i != "parent") {
                if(_.isObject(stree[i])) {
                    otree[i] = this._r_treeCopy(stree[i]);
                } else {
                    otree[i] = stree[i];
                }
            }
        }

        return otree;
    };

    // recursive inject function wrappers
    Injector.prototype._r_inject = function(newobj, oldobj, tree, name)
    {
       //var type = typeof(oldobj);
       //logz.log("Parent -", ", name:", name, ", type:", type);

       for(var key in oldobj)
       {
          if(oldobj.__profileINCLUDE)
          {
             if(!oldobj.__profileINCLUDE[key])
             {
                newobj[key] = oldobj[key];
                continue;
             }
          }

          var type = typeof(oldobj[key]);

          //var fullClassPathName = this._buildFullClassPathName(key, tree);
          //logz.log("Children", "key:", key, ", Full Class PathName:", fullClassPathName, ", type:", type);

          if(type == "function")
          {
             tree[key] = { "parent":tree,
                           "name":key,
                           "start":0,
                           "end":0,
                           "diff":0,
                           "heapSize":0,
                           "callCount":0 };
             newobj[key] = this._createFunc(newobj, oldobj, key, tree);
          }
          else if(type == "object")
          {
             var profile;
             if(oldobj[key].__profileEXCLUDE)
             {
                profile = false;
             } else {
                profile = true;
             }

             if(profile)
             {
                tree[key] = { "parent":tree, "name":key, "totalDiff":0, "totalMemory":{} };
                newobj[key] = this._r_inject(new Object(), oldobj[key], tree[key], key);
             } else {
                newobj[key] = oldobj[key];
             }
          }
          else {
             newobj[key] = oldobj[key];
          }
       }

       //logz.log("Parent - Done");
       return newobj;
    };

    Injector.prototype._buildFullClassPathName = function(key, parent)
    {
       var out = [key];
       var p = parent;

       while(p.parent != null)
       {
          out.splice(0, 0, p.name);
          p = p.parent;
       }

       return out.join(".");
    };


    Injector.prototype._createFunc = function(newobj, oldobj, key, tree)
    {
       var funcName = key;
       var fullClassPathName = this._buildFullClassPathName(key, tree);
       var stats = tree[key];
       var newFunc;

       newFunc = new Object(function()
       {
          var returnVal;

          ++stats.callCount;

          stats.start  = perf.now();
          stats.memory = perf.memory();

          // tigger original function
          returnVal = oldobj[funcName].apply(newobj, arguments);

          stats.end = perf.now();
          stats.diff = stats.end - stats.start;

          if(this.options.verbose) {
              logz.log("--", "\""+fullClassPathName+"\"", arguments, "Function Performance -- diff", stats.diff);
          }

          // apply to parent
          this._applyTotalsToParent(stats.parent, stats.diff, stats.memory);

          return returnVal;
       }.bind(this));

       return this._r_inject(newFunc, oldobj[key], stats, key);
    };

    Injector.prototype._applyTotalsToParent = function(parent, diff, memory)
    {
       parent.totalDiff     += diff;
       for(var i in memory) {
           // create if not exist
           if(!parent.totalMemory.hasOwnProperty(i)) {
               parent.totalMemory[i] = 0;
           }

           parent.totalMemory[i] += memory[i];
       }

       if(parent.parent != null)
       {
          this._applyTotalsToParent(parent.parent, diff, memory);
       }
    };


    /*
     * Profile Class - used by Profiler
     */
    Profiler = function(options)
    {
        // default
        this.options = _.merge({
            verbose: false,
            rampLow: 100,
            rampHigh: 1000,
            steps: 5,
            samples: 10
        }, options);
    };

    Profiler.prototype.run = function(options, func, args)
    {
        // if options is a function, then this is intended to be the func
        if(_.isFunction(options)) {
            func = options;
            // get options to default
            options = this.options;
        }
        // if options is object then merge with default settings
        else if(_.isObject(options)) {
            options = _.merge(this.options, options);
        }

        // make sure func is function or array
        if( !func ||
            !_.isArray(func) ||
            !_.isFunction(func)) {
            logz.log("Input needs a func to run");
            return;
        }

        // ensure compareFuncArray is an array
        if(!_.isArray(func)) {
            compareFuncArray = [func];
        } else {
            compareFuncArray = func;
        }

        var inc = Math.floor((options.rampHigh - options.rampLow)/(options.steps-1));
        var count = 0, diffList;
        var i, j, sum, diffFrameTime, loops, dataSize, mean, stddev;
        var results = [];

        loops = options.rampLow;
        dataSize = rampLow;
        while(count < options.steps) {
            // if initFunc, replace args with results
            if (options.initFunc) {
                options.args = [ initFunc(dataSize) ];
            }

            for (j = 0; j < compareFuncArray.length; ++j) {

                sum = 0;
                diffList = [];
                for (i = 0; i < options.samples; ++i) {
                    diffFrameTime = this._test(compareFuncArray[j], loops, options.args);
                    sum += diffFrameTime;
                    diffList.push(diffFrameTime);
                    //logz.log("--- diffFrameTime:", diffFrameTime);
                }

                mean = sum / options.samples;
                ++count;

                // calc std dev
                stddev = 0;
                sum = 0;
                for (i = 0; i < diffList.length; ++i) {
                    // (L[i] - Mean)^2
                    sum += ((diffList[i] - mean) * (diffList[i] - mean));
                }
                stddev = sum / (options.samples - 1);

                if(options.verbose) {
                    logz.log(
                        "--- Run:", count
                        , ", Name:", compareFuncArray[j].name
                        , ", Samples:", options.samples
                        , ", Loops:", loops
                        , ", Mean:", MATH.digitRound(mean, 3)
                        , ", StdDev:", MATH.digitRound(stddev, 3)
                    );
                }
                results.push({
                    run: count,
                    name: compareFuncArray[j].name,
                    samples: options.samples,
                    loops: loops,
                    mean: mean,
                    stddev: stddev
                });

                loops += inc;
            }
        }

        return results;
    };


    Profiler.prototype.compareArray = function(rampLow, rampHigh, steps, samples, initFunc, compareFuncArray)
    {
        var inc = Math.floor((rampHigh - rampLow)/(steps-1));
        var count = 0, diffList;
        var i, j, sum, diffFrameTime, data, args, dataSize, mean, stddev;

        dataSize = rampLow;
        while(count < steps)
        {
            data = initFunc(dataSize);
            args = [data];

            for(j = 0; j < compareFuncArray.length; ++j)
            {
                sum = 0;
                diffList = [];
                for(i = 0; i < samples; ++i)
                {
                    diffFrameTime = this._test(compareFuncArray[j], 1, args);
                    sum += diffFrameTime;
                    diffList.push(diffFrameTime);
                    //logz.log("--- diffFrameTime:", diffFrameTime);
                }

                mean = sum/samples;

                // calc std dev
                stddev = 0;
                sum = 0;
                for(i = 0; i < diffList.length; ++i)
                {
                    // (L[i] - Mean)^2
                    sum += ((diffList[i] - mean)*(diffList[i] - mean));
                }
                stddev = sum/(samples-1);

                logz.log("--- Run:", count+1,
                    ", Name:", compareFuncArray[j].name,
                    ", Samples:", samples,
                    ", DataSize:", dataSize,
                    ", Mean:", MATH.digitRound(mean, 3),
                    ", StdDev:", MATH.digitRound(stddev, 3));
            }

            dataSize += inc;
            ++count;
        }
    };

    Profiler.prototype._test = function(func, num, args)
    {
        var startFrameTime = perf.now();
        for(var i = 0; i < num; ++i)
        {
            func.apply(this, args);
        }
        var endFrameTime = perf.now();
        return endFrameTime - startFrameTime;
    };

})(_, LogZ, perf);
