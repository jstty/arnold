TEST.data = TEST.data || {};

TEST.data.all = function()
{
   var stats, DATA;
   
   stats = new STATS.Performance();
   
   DATA = stats.add(DATA, "DATA");   
   TEST.data = stats.add(TEST.data, "TEST.data");
   
   TEST.data.list();
}
