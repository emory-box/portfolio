// The original bread owns one continuous butter surface and its native copy.
import {createSkillsPages} from './home-skills-pages.js';
import {createButterMorph} from './home-butter-morph.js';
export function createSkillsArtwork(art,panel) {
  const stage=panel.querySelector('.home-skills-stage');
  const pages=createSkillsPages(panel);
  let focused=false,textSize=0;
  const butter=createButterMorph(art);
  function layout() {
    const bounds=stage.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
    textSize=parseFloat(getComputedStyle(document.documentElement).fontSize);
    const native=bounds.width>=1440&&innerHeight>=1024;
    const scale=native?1:Math.min(1,(bounds.width-32)/932.658,(innerHeight-88)/892.669);
    stage.style.setProperty('--skills-art-scale',String(scale));
    const left=native?(bounds.width-1440)/2-207:(bounds.width-932.658*scale)/2-445.386*scale;
    const top=native?(innerHeight-1024)/2-185:72+(innerHeight-88-892.669*scale)/2-249.157*scale;
    for(const [key,value]of Object.entries({'--bread-width':1854.1545*scale,'--bread-left':left,'--bread-top':top,'--cloud-left':left+207*scale,'--cloud-top':top+185*scale,'--skills-left':left+920*scale,'--skills-top':top+790*scale}))stage.style.setProperty(key,value+'px');
    pages.layout(550*scale,550*scale,scale);
  }
  function finish(open) {
    focused=open;if(open)layout();butter.finish(open);
  }
  function freeze() {
    focused=false;butter.freeze();
  }
  function morph(opening,animate,duration) {
    focused=false;return butter.morph(opening,animate,duration);
  }
  new ResizeObserver(()=>{if(focused)layout();}).observe(stage);
  const textObserver=new ResizeObserver(()=>{
    if(focused&&parseFloat(getComputedStyle(document.documentElement).fontSize)!==textSize)layout();
  });
  for(const text of panel.querySelectorAll('.home-skills-list,.home-skill-word > span'))textObserver.observe(text);
  return {layout,freeze,finish,melt:(animate,duration=900)=>morph(true,animate,duration),gather:(animate,duration=600)=>morph(false,animate,duration)};
}
