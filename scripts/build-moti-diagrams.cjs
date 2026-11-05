/* Authoring helper only: the published site serves the generated SVG files. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const models = require('../projects/moti-pulse/diagrams/flows.json');
const output = path.join(root, 'projects/moti-pulse/img/diagrams');
const palette = { canvas:'#dfe5ff', paper:'#ffffff', ink:'#202342', muted:'#606478', blue:'#4a5ff7', strong:'#2437b6', lavender:'#eef1ff' };

async function restyleFlow(page, slug, model) {
  // Source geometry and paint order are authoritative. Add paint classes only;
  // never rebuild nodes, glyph outlines, connectors or their transforms.
  const original=fs.readFileSync(path.join(root,'projects/moti-pulse',model.source),'utf8');
  await page.setContent(original);
  return page.evaluate(({slug,model,palette})=>{
    const svg=document.querySelector('svg');
    const nodes=[...svg.querySelectorAll('[fill="#AFF4C6"], [fill="#FFE8A3"], [fill="#BDE3FF"]')];
    if(nodes.length!==model.types.length)throw Error('Source node inventory changed: '+slug);
    const terminals=[];
    nodes.forEach((node,index)=>{
      const kind=model.types[index];
      if(kind==='terminal')terminals.push(node.getBoundingClientRect());
      node.classList.add('flow-node','flow-'+kind);
      node.setAttribute('data-node',index);node.setAttribute('data-kind',kind);
    });
    svg.querySelectorAll('[fill="#B3B3B3"]').forEach(wire=>wire.classList.add('flow-wire'));
    svg.querySelectorAll('[fill="black"]').forEach(label=>{
      label.classList.add('flow-label');
      const r=label.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;
      if(terminals.some(t=>cx>=t.x&&cx<=t.right&&cy>=t.y&&cy<=t.bottom))label.classList.add('flow-terminal-label');
    });
    const create=tag=>document.createElementNS('http://www.w3.org/2000/svg',tag);
    const title=create('title');title.id='flow-title-'+slug;title.textContent=model.title;
    const desc=create('desc');desc.id='flow-description-'+slug;
    desc.textContent='Original task-flow layout and wiring, styled for Moti-Pulse. '+model.labels.map(label=>label.replaceAll('\n',', ')).join('; ')+'.';
    const style=create('style');
    style.textContent='.flow-node{fill:'+palette.paper+';stroke:'+palette.blue+';stroke-width:.75;fill-opacity:1}.flow-screen{fill:'+palette.lavender+'}.flow-decision{fill:'+palette.canvas+';stroke:'+palette.strong+'}.flow-terminal{fill:'+palette.strong+';stroke:'+palette.strong+'}.flow-wire{fill:'+palette.strong+';stroke:'+palette.strong+';stroke-width:.35;stroke-linecap:round;stroke-linejoin:round}.flow-label{fill:'+palette.ink+';fill-opacity:1}.flow-terminal-label{fill:'+palette.paper+'}';
    svg.setAttribute('role','img');svg.setAttribute('aria-labelledby',title.id+' '+desc.id);
    svg.prepend(title,desc,style);
    return svg.outerHTML+'\n';
  },{slug,model,palette});
}

async function restyleArchitecture(page) {
  // This source export freezes the original HTML graph before its redesign.
  const original=fs.readFileSync(path.join(root,'projects/moti-pulse/diagrams/information-architecture-source.svg'),'utf8');
  await page.setContent(original);
  return page.evaluate(palette=>{
    const svg=document.querySelector('svg');
    if(svg.querySelectorAll('[data-node]').length!==14)throw Error('Architecture source inventory changed.');
    const style=document.createElementNS('http://www.w3.org/2000/svg','style');
    style.textContent='.architecture-node{fill:'+palette.paper+';stroke:'+palette.blue+';stroke-width:.75}.architecture-module{fill:'+palette.lavender+'}.architecture-root{fill:'+palette.strong+';stroke:'+palette.strong+'}.architecture-label{fill:'+palette.ink+'}.architecture-root-label{fill:'+palette.paper+'}.architecture-wire{fill:'+palette.strong+';stroke:'+palette.strong+';stroke-width:.35}.architecture-arrow{stroke:'+palette.strong+';stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round}';
    svg.append(style);
    return svg.outerHTML+'\n';
  },palette);
}

(async()=>{
  const packagePaths=[path.join(process.env.APPDATA||os.homedir(),'npm/node_modules/puppeteer-core'),'/usr/local/lib/node_modules/puppeteer-core','/opt/homebrew/lib/node_modules/puppeteer-core'];
  let puppeteer;
  try { puppeteer=require('puppeteer-core'); } catch {
    const installed=packagePaths.find(candidate=>fs.existsSync(candidate));
    if(!installed)throw Error('Run the existing project setup script to install puppeteer-core.');
    puppeteer=require(installed);
  }
  const chrome=process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':'/usr/bin/google-chrome');
  const browser=await puppeteer.launch({executablePath:chrome,headless:true,pipe:true,args:['--no-sandbox']});
  try {
    const page=await browser.newPage();
    fs.mkdirSync(output,{recursive:true});
    for(const [slug,model] of Object.entries(models)){
      if(model.labels.length!==model.types.length)throw Error(`Invalid node inventory: ${slug}`);
      fs.writeFileSync(path.join(output,`flow-${slug}.svg`),await restyleFlow(page,slug,model));
    }
    fs.writeFileSync(path.join(output,'information-architecture.svg'),await restyleArchitecture(page));
    const pageFile=path.join(root,'projects/moti-pulse/index.html');
    const html=fs.readFileSync(pageFile,'utf8');
    const updated=html.replace(/<(?:source|img)\b[^>]*(?:srcset|src)="img\/diagrams\/([\w-]+)\.svg"[^>]*>/g,(tag,name)=>{
      const svg=fs.readFileSync(path.join(output,name+'.svg'),'utf8');
      const width=Math.round(Number(svg.match(/\bwidth="([\d.]+)"/)[1]));
      const height=Math.round(Number(svg.match(/\bheight="([\d.]+)"/)[1]));
      return tag.replace(/\bwidth="[\d.]+"/,`width="${width}"`).replace(/\bheight="[\d.]+"/,`height="${height}"`);
    });
    if(updated!==html)fs.writeFileSync(pageFile,updated);
    console.log('Generated seven diagram style variants with source positions preserved.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
