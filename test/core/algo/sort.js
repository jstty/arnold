
/** @this {Element} */
TEST.algo.sort = function()
{
   this.compArray = function(a, b)
   {
      // size does not match
      if(a.length != b.length) return false;
        
      for(var i = 0; i < a.length; ++i)
      {
         if(a[i] != b[i])
         {
            return false;
         }
      }
      
      return true;
   }
   
   this.test = function(data, cmpFunc)
   {
      var sortdata, testdata;
      
      console.log("-----------------------");
      console.log("Native Sort");
      var startFrameTime = window.performance.now();
      if(cmpFunc == ALGO.comp.ASC)
         sortdata = data.sort( function(a, b){ return(a - b) } );
      else
         sortdata = data.sort( function(a, b){ return(b - a) } );
      
      var endFrameTime = window.performance.now();
      var diffFrameTime = endFrameTime - startFrameTime;      
      console.log("-- diffFrameTime", diffFrameTime);
      console.log("-----------------------");
   
      console.log("-----------------------"); 
      console.log("Bubble Sort");
      testdata = ALGO.sort(data.slice(), cmpFunc, "bubble");
      if(this.compArray(sortdata, testdata))
      {
         console.log("Bubble Sort: PASS");
      } else {
         console.error("Bubble Sort: FAIL");
      }
      console.log("-----------------------");
     
      console.log("-----------------------");
      console.log("Merge Sort");
      testdata = ALGO.sort(data.slice(), cmpFunc, "merge");
      if(this.compArray(sortdata, testdata))
      {
         console.log("Merge Sort: PASS");
      } else {
         console.error("Merge Sort: FAIL");
         //console.log("Correct Sort:", sortdata);
         //console.log("Merge Sort:", testdata);
      }
      console.log("-----------------------");
      
      
      console.log("-----------------------");
      console.log("Heap Sort");
      testdata = ALGO.sort(data.slice(), cmpFunc, "heap");
      if(this.compArray(sortdata, testdata))
      {
         console.log("Heap Sort: PASS");
         //console.log("Correct Sort:", sortdata);
         //console.log("Heap Sort:", testdata);
      } else {
         console.error("Heap Sort: FAIL");
         console.log("Correct Sort:", sortdata);
         console.log("Heap Sort:", testdata);
      }
      console.log("-----------------------");
      
      console.log("-----------------------");
      console.log("Quick Sort");
      testdata = ALGO.sort(data.slice(), cmpFunc, "quick");
      if(this.compArray(sortdata, testdata))
      {
         console.log("Quick Sort: PASS");
      } else {
         console.error("Quick Sort: FAIL");
      }
      console.log("-----------------------");
      
      
      console.log("-----------------------"); 
      console.log("Default Sort");
      testdata = ALGO.sort(data.slice(), cmpFunc);
      if(this.compArray(sortdata, testdata))
      {
         console.log("Default Sort: PASS");
      } else {
         console.error("Default Sort: FAIL");
      }
      console.log("-----------------------");
   }
   
   // fill data with random numbers
   var data = [], dataSize;
   //dataSize = 5;
   //dataSize = 50;
   //dataSize = 100;
   dataSize = 50000;
   //dataSize = 500000;
   //dataSize = 5000000;
   for(var i = 0; i < dataSize; ++i)
   {
      data.push( Math.random() );
   }
   
   console.log("----------------------------------------------");
   console.log("-- ALGO Sort Test");
   console.log("--- dataType:", UTIL.type.get(data[0]));
   console.log("--- dataSize:", dataSize);
   
   this.test(data, ALGO.comp.ASC);
   this.test(data, ALGO.comp.DESC);
   console.log("----------------------------------------------");
}
