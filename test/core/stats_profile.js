
/** @constructor */
TEST.Profile = function()
{
   this._startFrameTime = 0;
   this._endFrameTime   = 0;
}

/** @this {Element} */
TEST.Profile.prototype = {
   start : function(){
      this._startFrameTime = window.performance.now();
      
   },
   
   stop : function()
   {
      this._endFrameTime = window.performance.now();
   },
   
   test : function(func, num, args)
   {
      this.start();
      
      for(var i = 0; i < num; ++i)
      {
         func.apply(this, args);
      }
      
      this.stop();
      return this._endFrameTime - this._startFrameTime;
   }
}

/** @constructor */
TEST.StatsProfile = function()
{
   this.profile = new TEST.Profile();
}

/** @this {Element} */
TEST.StatsProfile.prototype = {
   
   test : function(rampLow, rampHigh, steps, samples, func, args)
   {
      var inc = Math.floor((rampHigh - rampLow)/(steps-1));
      var count = 0, runs, diffList;
      var i, avg, sum, diffFrameTime, loops, mean, stddev;
      
      loops = rampLow;
      while(count < steps)
      {
         sum = 0;
         diffList = [];
         for(i = 0; i < samples; ++i)
         {
            diffFrameTime = this.profile.test(func, loops, args);
            sum += diffFrameTime;
            diffList.push(diffFrameTime);
            //console.log("--- diffFrameTime:", diffFrameTime);
         }
         
         mean = sum/samples;
         ++count;
         
         // calc std dev
         stddev = 0;
         sum = 0;
         for(i = 0; i < diffList.length; ++i)
         {
            // (L[i] - Mean)^2
            sum += ((diffList[i] - mean)*(diffList[i] - mean));
         }
         stddev = sum/(samples-1);
         
         
         console.log(
            "--- Run:", count
            ,", Samples:", samples
            ,", Loops:", loops
            ,", Mean:", MATH.digitRound(mean, 3)
            ,", StdDev:", MATH.digitRound(stddev, 3)
         );
         
         loops += inc;
      }
      
   },
   
   compareArray : function(rampLow, rampHigh, steps, samples, initFunc, compareFuncArray)
   {
      var inc = Math.floor((rampHigh - rampLow)/(steps-1));
      var count = 0, runs, diffList;
      var i, j, avg, sum, diffFrameTime, data, args, dataSize, mean, stddev;
      
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
               diffFrameTime = this.profile.test(compareFuncArray[j], 1, args);
               sum += diffFrameTime;
               diffList.push(diffFrameTime);
               //console.log("--- diffFrameTime:", diffFrameTime);
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
            
            console.log("--- Run:", count+1, 
            ", Name:", compareFuncArray[j].name, 
            ", Samples:", samples, 
            ", DataSize:", dataSize, 
            ", Mean:", MATH.digitRound(mean, 3), 
            ", StdDev:", MATH.digitRound(stddev, 3));
         }
         
         dataSize += inc;
         ++count;
      }
   }
}

