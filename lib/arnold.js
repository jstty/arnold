




Arnold = function()
{
   this.tree = { "parent": null, "name":"root", "totalDiff":0, "totalHeapSize":0 };
};

Arnold.prototype.displayTree = function()
{
   console.log("tree:", this.tree);
};

Arnold.prototype.add = function(obj, key)
{
    this.tree[key] = { "parent": this.tree, "name":key, "totalDiff":0, "totalHeapSize":0 }
    var nobj = this._r_add(new Object(), obj, this.tree[key], key);

    return nobj;
};



Arnold.prototype._r_add = function(newobj, oldobj, tree, name)
{
   //var type = typeof(oldobj);
   //console.log("Parent -", ", name:", name, ", type:", type);
   
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
      //console.log("Children", "key:", key, ", Full Class PathName:", fullClassPathName, ", type:", type);
      
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
            tree[key] = { "parent":tree, "name":key, "totalDiff":0, "totalHeapSize":0 };
            newobj[key] = this._r_add(new Object(), oldobj[key], tree[key], key);
         } else {
            newobj[key] = oldobj[key];
         }
      }
      else {
         newobj[key] = oldobj[key];
      }
   }
   
   //console.log("Parent - Done");
   
   return newobj;
};

Arnold.prototype._buildFullClassPathName = function(key, parent)
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


Arnold.prototype._createFunc = function(newobj, oldobj, key, tree)
{
   var funcName = key;
   var fullClassPathName = this._buildFullClassPathName(key, tree);
   var stats = tree[key];
   var newFunc;
   
   newFunc = new Object(function()
   {
      var startFrameTime, endFrameTime, diffFrameTime;
      var heapSize, returnVal;
    
      ++stats.callCount;
      
      stats.start = window.performance.now();
      stats.heapSize = window.performance.memory.usedJSHeapSize;
      
      // tigger original function
      returnVal = oldobj[funcName].apply(newobj, arguments);
      
      stats.end = window.performance.now();
      stats.diff = stats.end - stats.start;
      
      console.log("--", "\""+fullClassPathName+"\"", arguments, "Function Performance -- diff", stats.diff);
      
      // apply to parent
      this._applyTotalsToParent(stats.parent, stats.diff, stats.heapSize);
      
      return returnVal;
   }.bind(this));
   
   return this._r_add(newFunc, oldobj[key], stats, key);
};

Arnold.prototype._applyTotalsToParent = function(parent, diff, heapSize)
{
   parent.totalDiff     += diff;
   parent.totalHeapSize += heapSize;
   
   if(parent.parent != null)
   {
      this.applyTotalsToParent(parent.parent, diff, heapSize);
   }
};
