const {createRequire}=require('node:module');
const {execSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');

function browserRuntime(){
  const roots=[process.cwd()];
  try{roots.push(execSync('npm root -g',{encoding:'utf8'}).trim());}catch{}
  let puppeteer;
  for(const root of roots){
    try{puppeteer=createRequire(path.join(root,'qa-loader.cjs'))('puppeteer-core');break;}catch{}
  }
  if(!puppeteer)throw new Error('puppeteer-core is missing. Run scripts/setup.ps1 or scripts/setup.sh.');
  const chromePath=process.env.CHROME_PATH||[
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome','/usr/bin/chromium',
  ].find(file=>fs.existsSync(file));
  if(!chromePath)throw new Error('Chrome is missing. Install Chrome or set CHROME_PATH.');
  return {puppeteer,chromePath};
}
module.exports={browserRuntime};
