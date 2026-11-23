// Optional QA helper; Playwright and its browsers are never shipped to visitors.
const {createRequire}=require('node:module');
const {execSync}=require('node:child_process');
const path=require('node:path');
function webkitRuntime(){
  if(process.env.PLAYWRIGHT_MODULE)return require(process.env.PLAYWRIGHT_MODULE);
  const roots=[process.cwd()];
  try{roots.push(execSync('npm root -g',{encoding:'utf8'}).trim());}catch{}
  for(const root of roots){
    try{return createRequire(path.join(root,'qa-loader.cjs'))('playwright');}catch{}
  }
  throw new Error('Install the optional QA helper: npm install -g playwright, then npx playwright install webkit. See README.md.');
}
module.exports={webkitRuntime};
