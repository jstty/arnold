TEST = TEST || {};
TEST.general = TEST.general || {};

TEST.general.all = function()
{
   TEST.general.PrivateVsPublic();
   TEST.general.IfCase();
}

TEST.general.PrivateVsPublic = function()
{
   var low = 10000, high = 100000;
   var stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   stat.compareArray(
         low, high, 5, 10,
            function(dataSize)
            {
               var data = [];
               for(var i = 0; i < dataSize; ++i)
               {
                  data.push( Math.random() );
               }
               return data;
            },
            [
               /** @constructor */
                function PrivateFunc(data){
                  var PrivateFuncTest = function(data)
                  {
                     function calc(data)
                     {
                        return Math.cos(data);
                     }
                     
                     return calc(data);
                  }
                  
                  var sum = 0;
                  for(var i = 0; i < data.length; ++i)
                  {
                     sum += PrivateFuncTest( data[i] );
                  }
                  
                  return sum;
               },
               /** @constructor */
               function PrivilegedFunc(data){
                  var PrivilegedFuncTest = function(data)
                  {
                     this.calc = function(data)
                     {
                        return Math.cos(data);
                     }
                  }
                  
                  var sum = 0;
                  var ptest = new PrivilegedFuncTest();
                  for(var i = 0; i < data.length; ++i)
                  {
                     sum += ptest.calc( data[i] );
                  }
                  
                  return sum;
               },
               /** @constructor */
               function PublicFunc(data){
                  var PublicFuncTest = function(){ }
                  PublicFuncTest.prototype.calc = function(data)
                  {
                     return Math.cos(data);
                  }
                  
                  var sum = 0;
                  var ptest = new PublicFuncTest();
                  for(var i = 0; i < data.length; ++i)
                  {
                     sum += ptest.calc( data[i] );
                  }
                  
                  return sum;
               }
            ]
         );

}


TEST.general.IfCase = function()
{
   var low = 10000, high = 100000;
   var stat, diffFrameTime;
   
   stat = new TEST.StatsProfile();
   
   console.log("-----------------------------------");
   console.log("-- Case Switch");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){
         var tmp = Math.random();
         var i = Math.floor(Math.random() * 100) % 5;
         switch(i)
         {
            case 0: Math.cos(tmp); break;
            case 1: Math.cos(tmp); break;
            case 2: Math.cos(tmp); break;
            case 3: Math.cos(tmp); break;
            case 4: Math.cos(tmp); break;
         }
      }
   );
   console.log("-----------------------------------");
   console.log("-- If Switch");
   diffFrameTime = stat.test(
      low, high, 5, 10,
      function(){
         var tmp = Math.random();
         var i = Math.floor(Math.random() * 100) % 5;
              if(i == 0) Math.cos(tmp);
         else if(i == 1) Math.cos(tmp);
         else if(i == 2) Math.cos(tmp);
         else if(i == 3) Math.cos(tmp);
         else if(i == 4) Math.cos(tmp);
      }
   );
}

