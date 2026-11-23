// A readable alternative to the source word cloud when the bread is small.
// Each supplied skill remains available without shrinking it into tiny text.
export function createSkillsPages(panel) {
  const stage=panel.querySelector('.home-skills-stage');
  const cloud=panel.querySelector('.home-skills-cloud');
  const mobile=panel.querySelector('.home-skills-mobile');
  const list=mobile.querySelector('ul'),items=[...list.children];
  const pager=document.createElement('div');pager.className='home-skills-pages';
  const count=document.createElement('span');count.setAttribute('role','status');count.setAttribute('aria-live','polite');
  let page=0,pageSize=items.length;
  function button(label,arrow,step) {
    const b=document.createElement('button');b.type='button';b.textContent=arrow;b.setAttribute('aria-label',label);
    b.addEventListener('click',()=>{page+=step;render();if(b.disabled)(step>0?previous:next).focus({preventScroll:true});});
    return b;
  }
  const previous=button('Previous skills','←',-1),next=button('Next skills','→',1);
  pager.append(previous,count,next);mobile.append(pager);
  function render() {
    const pages=Math.ceil(items.length/pageSize);page=Math.max(0,Math.min(page,pages-1));
    items.forEach((item,i)=>item.hidden=i<page*pageSize||i>=(page+1)*pageSize);
    count.textContent=(page+1)+' / '+pages;count.setAttribute('aria-label','Page '+(page+1)+' of '+pages);
    previous.disabled=page===0;next.disabled=page===pages-1;pager.hidden=pages===1;
  }
  return {layout(width,height,scale) {
    const enlarged=parseFloat(getComputedStyle(document.documentElement).fontSize)>20;
    const compact=scale<.65||enlarged;
    stage.dataset.skillsMode=compact?'paged':'cloud';cloud.hidden=compact;mobile.hidden=!compact;
    if(!compact)return;
    mobile.style.width=Math.max(120,width)+'px';
    items.forEach(item=>item.hidden=false);
    const title=mobile.querySelector('h3').getBoundingClientRect().height;
    const row=Math.max(...items.map(item=>item.getBoundingClientRect().height));
    pageSize=Math.max(1,Math.floor((height-title-68)/(row+8)));
    render();
  }};
}
