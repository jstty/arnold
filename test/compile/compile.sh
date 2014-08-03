#!/bin/bash

#--formatting PRETTY_PRINT \
java -jar ../../compiler/closure/compiler.jar \
--summary_detail_level 3 \
--warning_level VERBOSE \
--compilation_level ADVANCED_OPTIMIZATIONS \
--debug \
--js="../../lib/core/util/util.js" \
--js="../../lib/core/algo/algo.js" \
--js="../../lib/core/data/data.js" \
--js="../../lib/core/math/math.js" \
--js="../../lib/core/algo/sort/merge.js" \
--js="../../lib/core/algo/sort/quick.js" \
--js="../../lib/core/algo/sort/bubble.js" \
--js="../../lib/core/algo/sort/heap.js" \
--js="../../lib/core/algo/sort.js" \
--js="../core/test.js" \
--js="../core/stats_profile.js" \
--js="../core/general.js" \
--js="../core/algo/algo.js" \
--js="../core/algo/sort.js" \
--js="../core/data/data.js" \
--js="../core/data/list.js" \
--js="../../lib/core/data/list/priority-queue.js" \
--js="../../lib/core/stats/performance.js" \
--js="../benchmark.js" \
--externs "../../compiler/externs.js" \
2> compiler_report.txt > compiled.js


#for file in $(find core -name "*.js"); do 
#   java -jar ../compiler/closure/compiler.jar --summary_detail_level 3 --warning_level VERBOSE --language_in ECMASCRIPT5_STRICT --compilation_level ADVANCED_OPTIMIZATIONS  --formatting PRETTY_PRINT --debug --js=$file &> compiler_report/$file
#done

#find core -name "*.js" -exec java -jar ../compiler/closure/compiler.jar --summary_detail_level 3 --warning_level VERBOSE --language_in ECMASCRIPT5_STRICT --compilation_level ADVANCED_OPTIMIZATIONS  --formatting PRETTY_PRINT --debug --js={} \> compiler_report/{} \;


#java -jar ../compiler/closure/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS  --formatting PRETTY_PRINT --debug --js=core/algo/algo.js


