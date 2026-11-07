// Static delivery checks; no browser or package installation is needed.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const pending=['index.html','projects/greeny/index.html','projects/moti-pulse/index.html','projects/synergy/index.html'];
const visited=new Set();
const isLocal=url=>url&&!/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);

function resolveAsset(from,url){
  let pathname=decodeURIComponent(url.split(/[?#]/)[0]);
  assert(!pathname.startsWith('/'),'Site URL must be relative: '+from+' -> '+url);
  let target=path.resolve(root,path.dirname(from),pathname);
  assert(target.startsWith(root+path.sep),'Reference escapes repository: '+url);
  assert(fs.existsSync(target),'Missing asset: '+from+' -> '+url);
  if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),'Missing directory index: '+from+' -> '+url);
  return path.relative(root,target).replaceAll('\\','/');
}

while(pending.length){
  const file=pending.pop();if(visited.has(file))continue;visited.add(file);
  if(!/\.(html|css|js|mjs)$/.test(file))continue;
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const refs=[];
  if(file.endsWith('.html'))for(const match of text.matchAll(/(?:src|href|poster)\s*=\s*(["'])(.*?)\1/g))refs.push(match[2]);
  if(file.endsWith('.css'))for(const match of text.matchAll(/url\(\s*["']?([^\s)'";]+)["']?\s*\)/g))refs.push(match[1]);
  if(/\.(js|mjs)$/.test(file)){
    for(const match of text.matchAll(/new URL\(\s*['"]([^'"]+)['"]/g))refs.push(match[1]);
    for(const match of text.matchAll(/(?:from\s*|import\(\s*)['"](\.[^'"]+)['"]/g))refs.push(match[1]);
  }
  for(const ref of refs)if(isLocal(ref))pending.push(resolveAsset(file,ref.replaceAll('&amp;','&')));
}
assert(fs.existsSync(path.join(root,'.nojekyll')),'Missing GitHub Pages .nojekyll');
console.log('PASS static delivery: '+visited.size+' reachable local files across all four pages.');
