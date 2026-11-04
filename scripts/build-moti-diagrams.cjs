/* Authoring helper only: the published site serves the generated SVG files. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const models = require('../projects/moti-pulse/diagrams/flows.json');
const output = path.join(root, 'projects/moti-pulse/img/diagrams');
const font = fs.readFileSync(path.join(root, 'assets/fonts/inter-latin.woff2')).toString('base64');
const palette = { canvas:'#dfe5ff', paper:'#ffffff', ink:'#202342', muted:'#606478', blue:'#4a5ff7', strong:'#2437b6', lavender:'#eef1ff' };
const xml = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));

function head(title, width, height, description, canvas = palette.canvas) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description"><title id="title">${xml(title)}</title><desc id="description">${xml(description)}</desc><defs><style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}text{font-family:Inter,sans-serif;fill:${palette.ink};font-size:16px;font-weight:450}.edge{fill:none;stroke:${palette.muted};stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.edge-halo{fill:none;stroke:${canvas};stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.branch{font-size:13px;font-weight:550}.node{stroke:${palette.blue};stroke-width:1.5}.terminal{fill:${palette.strong};stroke:${palette.strong}}.terminal-text{fill:${palette.paper};font-weight:600}.module-text{font-weight:600}</style><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="${palette.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
}

function textBlock(lines, x, cy, className = '') {
  const y = cy - (lines.length - 1) * 11;
  return `<text class="${className}" text-anchor="middle">${lines.map((line, index) => `<tspan x="${x}" y="${y + index * 22}" dominant-baseline="central">${xml(line)}</tspan>`).join('')}</text>`;
}

function nodeShape(node) {
  const {x,y,w,h,type,lines,id} = node;
  const left = x-w/2, top = y-h/2;
  const fill = type==='screen' ? palette.lavender : type==='decision' ? palette.canvas : palette.paper;
  const shape = type==='decision'
    ? `<path class="node" fill="${fill}" d="M${x} ${top} ${left+w} ${y} ${x} ${top+h} ${left} ${y}Z"/>`
    : `<rect class="node ${type==='terminal'?'terminal':''}" x="${left}" y="${top}" width="${w}" height="${h}" rx="${type==='terminal'?h/2:12}" fill="${fill}"/>`;
  return `<g data-node="${id}" data-kind="${type}">${shape}${textBlock(lines,x,y,type==='terminal'?'terminal-text':'')}</g>`;
}

function roundedPath(input) {
  const points = input.filter((point, index) => !index || point[0]!==input[index-1][0] || point[1]!==input[index-1][1]);
  let d = `M${points[0].join(' ')}`;
  for (let i=1;i<points.length;i++) {
    if (i===points.length-1) { d+=` L${points[i].join(' ')}`; continue; }
    const before=points[i-1],current=points[i],after=points[i+1];
    const incoming=Math.hypot(current[0]-before[0],current[1]-before[1]);
    const outgoing=Math.hypot(after[0]-current[0],after[1]-current[1]);
    const radius=Math.min(8,incoming/2,outgoing/2);
    const a=current.map((value,k)=>value+(before[k]-value)*radius/incoming);
    const b=current.map((value,k)=>value+(after[k]-value)*radius/outgoing);
    d+=` L${a.join(' ')} Q${current.join(' ')} ${b.join(' ')}`;
  }
  return d;
}

function edgeShape(points, label, data, canvas, halo = true) {
  const d=roundedPath(points);
  let labelSvg='';
  if(label) {
    const [x,y,anchor='middle']=data;
    const width=label==='Yes'?30:24;
    const left=anchor==='end'?x-width:anchor==='start'?x:x-width/2;
    labelSvg=`<rect x="${left-3}" y="${y-13}" width="${width+6}" height="20" rx="4" fill="${canvas}"/><text class="branch" x="${x}" y="${y}" text-anchor="${anchor}">${xml(label)}</text>`;
  }
  return `<g>${halo?`<path class="edge-halo" d="${d}"/>`:''}<path class="edge" marker-end="url(#arrow)" d="${d}"/>${labelSvg}</g>`;
}

function flowSvg(slug, model, lines, mobile) {
  const width=mobile?320:1120;
  const columns=mobile?1:4;
  const placed=new Map();
  const rowCount=Math.ceil(model.order.length/columns);
  let rowTop=mobile?24:40;
  for(let row=0;row<rowCount;row++) {
    const rowIds=model.order.slice(row*columns,(row+1)*columns);
    const items=rowIds.map(id=>{
      const type=model.types[id],wrapped=lines[id];
      return{id,type,lines:wrapped,w:type==='terminal'?(mobile?128:144):(mobile?216:192),h:type==='terminal'?48:type==='decision'?Math.max(128,wrapped.length*44+24):Math.max(72,wrapped.length*22+28)};
    });
    const height=Math.max(...items.map(node=>node.h));
    items.forEach((node,index)=>{
      const column=mobile?0:row%2===0?index:columns-1-index;
      placed.set(node.id,{...node,row,column,x:mobile?160:200+column*240,y:rowTop+height/2});
    });
    rowTop+=height+(mobile?44:88);
  }
  const height=rowTop-(mobile?44:88)+(mobile?24:40);
  const lanes={left:[],right:[]};
  const wires=[];
  for(const [from,to,label] of model.edges) {
    const a=placed.get(from),b=placed.get(to);
    const reverseLink=model.edges.some(([f,t])=>f===to&&t===from)&&model.order.indexOf(from)>model.order.indexOf(to);
    let points,position;
    if(a.row===b.row&&Math.abs(a.column-b.column)===1&&!reverseLink) {
      const direction=Math.sign(b.x-a.x);
      points=[[a.x+direction*a.w/2,a.y],[b.x-direction*b.w/2,b.y]];
      position=[(points[0][0]+points[1][0])/2,a.y-10];
    } else if(a.column===b.column&&b.row===a.row+1) {
      points=[[a.x,a.y+a.h/2],[b.x,b.y-b.h/2]];
      position=[a.x+12,(points[0][1]+points[1][1])/2+4,'start'];
    } else if(!mobile&&a.row===b.row) {
      const band=Math.min(a.y-a.h/2,b.y-b.h/2)-24;
      points=[[a.x,a.y-a.h/2],[a.x,band],[b.x,band],[b.x,b.y-b.h/2]];
      position=[a.x+12,a.y-a.h/2-10,'start'];
    } else {
      const low=Math.min(a.row,b.row),high=Math.max(a.row,b.row);
      const side=b.row<a.row?'right':label==='No'?'left':(from+to)%2?'right':'left';
      let lane=lanes[side].findIndex(intervals=>intervals.every(([l,h])=>high<l||low>h));
      if(lane<0){lane=lanes[side].length;lanes[side].push([]);}lanes[side][lane].push([low,high]);
      if(mobile&&lane>3)throw Error(`${slug}: mobile routing requires more than four ${side} lanes`);
      const outer=side==='left'?(mobile?12+lane*9:16+lane*10):(mobile?308-lane*9:1104-lane*10);
      if(mobile) {
        const sign=side==='left'?-1:1;
        points=[[a.x+sign*a.w/2,a.y],[outer,a.y],[outer,b.y],[b.x+sign*b.w/2,b.y]];
        position=[a.x+sign*(a.w/2+12),a.y-12,side==='left'?'end':'start'];
      } else {
        const direction=b.row>=a.row?1:-1;
        const sy=a.y+direction*a.h/2,ty=b.y-direction*b.h/2;
        const sourceBand=sy+direction*24,targetBand=ty-direction*24;
        points=[[a.x,sy],[a.x,sourceBand],[outer,sourceBand],[outer,targetBand],[b.x,targetBand],[b.x,ty]];
        position=[a.x+12,sy+direction*16,'start'];
      }
    }
    wires.push(`<g data-from="${from}" data-to="${to}"${label?` data-branch="${xml(label)}"`:''}>${edgeShape(points,label,position,palette.canvas)}</g>`);
  }
  const description=`${model.title}. ${model.labels.map(label=>label.replaceAll('\n',', ')).join('; ')}. Connections: ${model.edges.map(([from,to,label])=>`${model.labels[from].replaceAll('\n',', ')} to ${model.labels[to].replaceAll('\n',', ')}${label?' ('+label+')':''}`).join('; ')}.`;
  return head(model.title,width,height,description)+wires.join('')+[...placed.values()].map(nodeShape).join('')+'</svg>\n';
}

const architecture=[['Dashboard',['Calendar','Today Tasks']],['Life mission',['My Mission','Tips to create Life Mission','Importance of Life Mission']],['Goal',['Goal & Tasks','Life mission']],['Timer',['Pomodoro','Report']]];
function architectureSvg(lines,mobile) {
  const canvas=palette.lavender,width=mobile?320:1120;
  const nodes=[],wires=[];
  const app={id:'app',type:'terminal',x:mobile?160:560,y:48,w:mobile?128:180,h:56,lines:['App']};
  nodes.push(nodeShape(app));
  let y=136;
  architecture.forEach(([label,children],index)=>{
    const x=mobile?172:164+index*264;
    const top=mobile?y:152;
    const header={id:`module-${index}`,type:'screen',x,y:top+28,w:mobile?240:232,h:56,lines:[label]};
    nodes.push(nodeShape(header));
    wires.push(edgeShape(mobile?[[160,76],[160,100],[24,100],[24,header.y],[52,header.y]]:[[560,76],[560,112],[x,112],[x,top]],null,null,canvas,false));
    children.forEach((child,childIndex)=>{
      const cx=mobile?184:x,cy=top+112+childIndex*80;
      const leaf={id:`leaf-${index}-${childIndex}`,type:'action',x:cx,y:cy,w:mobile?216:232,h:64,lines:lines[index][childIndex]};
      nodes.push(nodeShape(leaf));
      const spine=mobile?60:x-132;
      wires.push(edgeShape([[x,top+56],[x,top+72],[spine,top+72],[spine,cy],[cx-leaf.w/2,cy]],null,null,canvas,false));
    });
    if(mobile)y=top+112+(children.length-1)*80+32+56;
  });
  const height=mobile?y:496;
  return head('Information Architecture',width,height,'App. '+architecture.map(([name,children])=>`${name}: ${children.join(', ')}`).join('. '),canvas)+wires.join('')+nodes.join('')+'</svg>\n';
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
    await page.setContent(`<style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}</style>`);
    await page.evaluate(()=>document.fonts.load('450 16px Inter'));
    const wrapped=await page.evaluate(({models,architecture})=>{
      const context=document.createElement('canvas').getContext('2d');context.font='450 16px Inter';
      function wrap(text,width){
        return text.split('\n').flatMap(paragraph=>{
          const lines=[];let current='';
          for(const word of paragraph.split(' ')){const next=current?current+' '+word:word;if(current&&context.measureText(next).width>width){lines.push(current);current=word;}else current=next;}
          if(current)lines.push(current);return lines;
        });
      }
      return{flows:Object.fromEntries(Object.entries(models).map(([slug,model])=>[slug,model.labels.map((label,id)=>wrap(label,model.types[id]==='decision'?124:model.types[id]==='terminal'?116:168))])),architecture:architecture.map(([,children])=>children.map(label=>wrap(label,192)))};
    },{models,architecture});
    fs.mkdirSync(output,{recursive:true});
    for(const [slug,model] of Object.entries(models)){
      if(model.labels.length!==model.types.length||new Set(model.order).size!==model.labels.length)throw Error(`Invalid node inventory: ${slug}`);
      for(const mobile of [false,true])fs.writeFileSync(path.join(output,`flow-${slug}${mobile?'-mobile':''}.svg`),flowSvg(slug,model,wrapped.flows[slug],mobile));
    }
    for(const mobile of [false,true])fs.writeFileSync(path.join(output,`information-architecture${mobile?'-mobile':''}.svg`),architectureSvg(wrapped.architecture,mobile));
    const pageFile=path.join(root,'projects/moti-pulse/index.html');
    const html=fs.readFileSync(pageFile,'utf8');
    const updated=html.replace(/<(?:source|img)\b[^>]*(?:srcset|src)="img\/diagrams\/([\w-]+)\.svg"[^>]*>/g,(tag,name)=>{
      const svg=fs.readFileSync(path.join(output,name+'.svg'),'utf8');
      const [,width,height]=svg.match(/^<svg[^>]*width="(\d+)" height="(\d+)"/);
      return tag.replace(/\bwidth="\d+"/,`width="${width}"`).replace(/\bheight="\d+"/,`height="${height}"`);
    });
    if(updated!==html)fs.writeFileSync(pageFile,updated);
    console.log('Generated 14 standalone, self-contained SVG diagrams with embedded Inter.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
