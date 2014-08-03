
/** @this {Element} */
TEST.data.list = function()
{   
   this.test = function(dataSize, compFunc)
   {
      //
      var low = 1, high = 3000;
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
               function Native(data){
                  var sortdata = [];
                  for(var i = 0; i < data.length; ++i)
                  {
                     // insert at start
                     sortdata.splice(0, 0, data[i]);
                     sortdata = ALGO.sort( sortdata );
                  }
                  return sortdata;
               },
               function PriorityQueue(data){
                  var pq = new DATA.Class.PriorityQueue(compFunc);
                  for(var i = 0; i < data.length; ++i)
                  {
                     pq.add( data[i] );
                  }
                  return pq.getArray();
               }
               /*,
               function PriorityQueueHeap2(data){
                  var pq = new DATA.Class.PriorityQueue(compFunc, "heap2");
                  for(var i = 0; i < data.length; ++i)
                  {
                     pq.add( data[i] );
                  }
                  return pq.getArray();
               }
               */
            ]
         );
      //
   }
   
   // fill data with random numbers
   var data = [], dataSize;
   dataSize = 100;
   //dataSize = 100;
   dataSize = 1000;
   //dataSize = 10000;
   //dataSize = 100000;
   //dataSize = 1000000;
   
   console.log("----------------------------------------------");
   console.log("-- DATA List Test");
   this.test(dataSize, ALGO.comp.ASC);
   console.log("----------------------------------------------");
}
