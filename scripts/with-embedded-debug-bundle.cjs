const {withAppBuildGradle}=require('@expo/config-plugins');
module.exports=config=>withAppBuildGradle(config,c=>{
 const active=/^\s*debuggableVariants\s*=\s*\[[^\]]*\]/m;
 c.modResults.contents=active.test(c.modResults.contents)?c.modResults.contents.replace(active,'    debuggableVariants = []'):c.modResults.contents.replace(/react\s*\{/,'react {\n    debuggableVariants = []');
 return c;
});
