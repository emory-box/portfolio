const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');

const root=path.resolve(__dirname,'../../..');
const available=fs.readdirSync(__dirname).filter(name=>/^check-home-.+\.cjs$/.test(name)).sort();
const requested=process.argv.slice(2).map(name=>name.endsWith('.cjs')?name:name+'.cjs');
const checks=requested.length?requested:available;
for(const name of checks)if(!available.includes(name))throw new Error('Unknown Home check: '+name);
const output=path.join(root,'.cache/qa/home-suite');
fs.mkdirSync(output,{recursive:true});
let next=0;
const results=[];
async function worker(){
  while(next<checks.length){
    const name=checks[next++],started=Date.now();
    const result=await new Promise(resolve=>{
      const child=spawn(process.execPath,[path.join(__dirname,name)],{cwd:root,windowsHide:true});
      let log='';
      child.stdout.on('data',data=>log+=data);
      child.stderr.on('data',data=>log+=data);
      child.on('error',error=>{log+=error.message;});
      child.on('close',code=>resolve({name,code:code??1,seconds:Math.round((Date.now()-started)/1000),log}));
    });
    fs.writeFileSync(path.join(output,name+'.log'),result.log);
    results.push({name:result.name,code:result.code,seconds:result.seconds});
    console.log((result.code===0?'PASS ':'FAIL ')+name+' ('+result.seconds+'s)');
    if(result.code!==0)console.log(result.log.trim());
  }
}
Promise.all([worker(),worker()]).then(()=>{
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
  const failed=results.filter(result=>result.code!==0);
  console.log((checks.length-failed.length)+'/'+checks.length+' Home checks passed. Logs: .cache/qa/home-suite/');
  if(failed.length)process.exitCode=1;
}).catch(error=>{console.error(error);process.exitCode=1;});
