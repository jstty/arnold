TEST.algo = TEST.algo || {};

TEST.algo.all = function()
{
   var stats = new STATS.Performance();
   
   ALGO = stats.add(ALGO, "ALGO");   
   TEST.algo = stats.add(TEST.algo, "TEST.algo");
   
   TEST.algo.sort();
}
