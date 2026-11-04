const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function executable(name,configured){
  if(configured){if(!fs.existsSync(configured))throw new Error(`${name} path does not exist: ${configured}`);return configured;}
  const filename=process.platform==='win32'?name+'.exe':name;
  for(const dir of (process.env.PATH||'').split(path.delimiter)){const file=path.join(dir.replace(/^"|"$/g,''),filename);if(fs.existsSync(file))return file;}
  const packages=process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Microsoft/WinGet/Packages');
  if(packages&&fs.existsSync(packages))for(const entry of fs.readdirSync(packages).filter(n=>n.startsWith('Gyan.FFmpeg_'))){const folder=path.join(packages,entry);for(const build of fs.readdirSync(folder)){const file=path.join(folder,build,'bin',filename);if(fs.existsSync(file))return file;}}
  throw new Error(`Cannot find ${name}; put it on PATH or set HYPERFRAMES_${name.toUpperCase()}_PATH.`);
}
function runtime(){
  const ffmpeg=executable('ffmpeg',process.env.HYPERFRAMES_FFMPEG_PATH),ffprobe=executable('ffprobe',process.env.HYPERFRAMES_FFPROBE_PATH);
  let cli=process.env.HYPERFRAMES_CLI_PATH;
  if(cli&&!cli.endsWith('.mjs'))cli=path.join(cli,'bin/hyperframes.mjs');
  if(!cli){const cache=process.env.npm_config_cache||path.join(process.env.LOCALAPPDATA||process.env.HOME,'npm-cache');const npx=path.join(cache,'_npx');if(fs.existsSync(npx))for(const d of fs.readdirSync(npx)){const pkg=path.join(npx,d,'node_modules/hyperframes');try{if(JSON.parse(fs.readFileSync(path.join(pkg,'package.json'))).version==='0.9.13'){cli=path.join(pkg,'bin/hyperframes.mjs');break;}}catch{}}}
  if(!cli||!fs.existsSync(cli))throw new Error('Run npx hyperframes@0.9.13 usage --json first, or set HYPERFRAMES_CLI_PATH.');
  return{ffmpeg,ffprobe,cli,gsap:path.resolve(path.dirname(cli),'../dist/vendor/npm/gsap@3.15.0/dist/gsap.min.js'),env:{...process.env,HYPERFRAMES_FFMPEG_PATH:ffmpeg,HYPERFRAMES_FFPROBE_PATH:ffprobe}};
}
const fileHash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function renderFingerprint(dir){const hash=crypto.createHash('sha256');hash.update('hyperframes@0.9.13;delivery;fps=30;').update(fs.readFileSync(path.join(__dirname,'moti-loop-return.cjs')));for(const file of ['index.html','compositions/loop-return.html','assets/original.mp4','assets/first-frame.png','assets/last-frame.png','assets/gsap.min.js'])hash.update(file).update(fs.readFileSync(path.join(dir,file)));return hash.digest('hex');}
module.exports={runtime,fileHash,renderFingerprint};
