TEST = TEST || {};
TEST.math = TEST.math || {};

TEST.math.all = function()
{   
   TEST.math.Random();
   
   TEST.math.MultTwo();
   TEST.math.DivTwo();
   TEST.math.PowTwo();
   TEST.math.Floor();
}

TEST.math.RandomDistribution = function(rand)
{
   var i, j, rval, a = [], low, high;
   
   loops = 1000;
   steps = 10;
   
   step = 1/steps;
   low = 0;
   high = step;
   for(i = 0; i < steps; ++i)
   {
      a.push({l:MATH.digitRound(low, 2), h:MATH.digitRound(high, 2), c:0});
      low   = high;
      high += step;
   }
   
   for(i = 0; i < loops; ++i)
   {
      rval = rand();
      
      for(j = 0; j < steps; ++j)
      {  
         if( (a[j].l <= rval) && (a[j].h > rval))
         {
            ++(a[j].c);
         }
      }
   }
   
   low = a[0].c;
   high = a[0].c;
   for(i = 1; i < steps; ++i)
   {
      if(a[i].c > high){ high = a[i].c; }
      if(a[i].c < low) { low  = a[i].c; }
   }
   
   diff = high - low;
   console.log("-- RandomDistribution - high:", high, ", low:", low, ", diff:", diff);
   
   /*
   for(i = 0; i < steps; ++i)
   {
      console.log(a[i]);
   }
   */
}


TEST.math.Random = function()
{
   var low = 1000, high = 100000;
   var stat, diffFrameTime;
   var rand;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- Math.random (Native)");
   this.RandomDistribution(Math.random);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random(); }
   );
   
   
   console.log("-----------------------------------");
   console.log("-- MATH.rand");
   //MATH.srand(123456789);
   
   this.RandomDistribution(MATH.rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return MATH.rand(); }
   );
   
   /*
   console.log("-----------------------------------");
   console.log("-- KISS07 Random");
   rand = new KISS07();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
   /*
   console.log("-----------------------------------");
   console.log("-- Kybos Random");
   rand = new Kybos();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
   /*
   console.log("-----------------------------------");
   console.log("-- LFib Random");
   rand = new LFib();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
   /*
   console.log("-----------------------------------");
   console.log("-- LFIB4 Random");
   rand = new LFIB4();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
   /*
   console.log("-----------------------------------");
   console.log("-- MRG32k3a Random");
   rand = new MRG32k3a();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
   /*
   console.log("-----------------------------------");
   console.log("-- Xorshift03 Random");
   rand = new Xorshift03();
   this.RandomDistribution(rand);
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return rand(); }
   );
   */
}

TEST.math.PowTwo = function()
{
   var low = 1000, high = 100000;
   var stat, diffFrameTime;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- Math.pow(x, 2)");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.pow(Math.random(), 2); }
   );

   console.log("-----------------------------------");
   console.log("-- x * x");   
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ var tmp = Math.random(); return (tmp*tmp); }
   );  
}

TEST.math.MultTwo = function()
{
   var low = 1000, high = 100000;
   var stat, diffFrameTime;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- x * 2");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random() * 2; }
   );

   console.log("-----------------------------------");
   console.log("-- x << 1");   
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random() << 1; }
   );  
}

TEST.math.DivTwo = function()
{
   var low = 1000, high = 100000;
   var stat, diffFrameTime;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- x / 2");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random() / 2; }
   );
   
   console.log("-----------------------------------");
   console.log("-- x * 0.5");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random() * 0.5; }
   );

   console.log("-----------------------------------");
   console.log("-- x >> 1");   
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.random() >> 1; }
   );
}

TEST.math.Floor = function()
{
   var low = 1000, high = 100000;
   var stat, diffFrameTime;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- Math.floor");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return Math.floor(Math.random() * 100); }
   );
   
   console.log("-----------------------------------");
   console.log("-- (~~)");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){ return ~~(Math.random() * 100); }
   );
}

