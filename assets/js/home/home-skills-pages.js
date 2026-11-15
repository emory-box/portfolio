// Keeps readable native skills on a contained bread: groups first, short pages
// only when an unusually short viewport cannot fit a complete group.
export function createSkillsPages(panel) {
  const stage=panel.querySelector('.home-skills-stage'),layout=panel.querySelector('.home-skills-groups');
  const groups=[...layout.querySelectorAll('.home-skills-group')],items=groups.map(g=>[...g.querySelectorAll('li')]);
  const tabs=document.createElement('div');tabs.className='home-skills-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Skill groups');tabs.hidden=true;
  const buttons=groups.map((group,i)=>{
    const button=document.createElement('button');button.type='button';button.id='skills-tab-'+i;button.setAttribute('role','tab');button.textContent=group.querySelector('h3').textContent;
    group.id='skills-group-'+i;button.setAttribute('aria-controls',group.id);button.addEventListener('click',()=>select(i));tabs.append(button);return button;
  });
  const pager=document.createElement('div');pager.className='home-skills-pages';pager.hidden=true;
  function arrow(label,text,step){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',label);button.textContent=text;button.addEventListener('click',()=>{page+=step;render();if(button.disabled)(step>0?previous:next).focus({preventScroll:true});});return button;}
  const previous=arrow('Previous skills','←',-1),next=arrow('Next skills','→',1),count=document.createElement('span');count.setAttribute('role','status');count.setAttribute('aria-live','polite');pager.append(previous,count,next);
  layout.prepend(tabs);layout.append(pager);
  let selected=0,page=0,roomWidth=0,roomHeight=0;
  function select(index){selected=index;page=0;render();buttons[index].focus({preventScroll:true});}
  tabs.addEventListener('keydown',event=>{let index=selected;if(event.key==='ArrowRight')index=(index+1)%groups.length;else if(event.key==='ArrowLeft')index=(index+groups.length-1)%groups.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=groups.length-1;else return;event.preventDefault();select(index);});
  function render(){
    const hadTabFocus=tabs.contains(document.activeElement);
    stage.dataset.skillsMode='full';tabs.hidden=pager.hidden=true;
    layout.style.width=Math.min(480,roomWidth)+'px';layout.style.height='';layout.style.marginTop='';
    groups.forEach((group,i)=>{group.hidden=false;group.removeAttribute('role');group.setAttribute('aria-labelledby',group.querySelector('h3').id);items[i].forEach(item=>item.hidden=false);});
    const rootSize=parseFloat(getComputedStyle(document.documentElement).fontSize);
    if(roomWidth>=22*rootSize&&layout.getBoundingClientRect().height<=roomHeight){if(hadTabFocus)document.querySelector('.home-return')?.focus({preventScroll:true});return;}
    stage.dataset.skillsMode='paged';tabs.hidden=false;layout.style.height=roomHeight+'px';
    // Short visible labels leave room for enlarged text and its pager. The
    // complete group name remains the accessible label at every size.
    buttons.forEach((button,i)=>{const title=groups[i].querySelector('h3').textContent;button.textContent=rootSize>20&&roomWidth<240?title.split(' ')[0]:title;button.setAttribute('aria-label',title);});
    groups.forEach((group,i)=>{group.hidden=i!==selected;group.setAttribute('role','tabpanel');group.setAttribute('aria-labelledby',buttons[i].id);buttons[i].setAttribute('aria-selected',String(i===selected));buttons[i].tabIndex=i===selected?0:-1;});
    const list=groups[selected].querySelector('ul'),tabHeight=tabs.getBoundingClientRect().height;
    if(list.getBoundingClientRect().height+tabHeight+8<=roomHeight)return;
    pager.hidden=false;
    const available=Math.max(1,roomHeight-tabHeight-pager.getBoundingClientRect().height-16),gap=parseFloat(getComputedStyle(list).rowGap)||0,pages=[[]];let used=0;
    for(const item of items[selected]){const style=getComputedStyle(item),h=item.getBoundingClientRect().height+(parseFloat(style.marginTop)||0)+(parseFloat(style.marginBottom)||0);if(pages.at(-1).length&&used+gap+h>available){pages.push([]);used=0;}pages.at(-1).push(item);used+=h+(used?gap:0);}
    page=Math.max(0,Math.min(page,pages.length-1));items[selected].forEach(item=>item.hidden=!pages[page].includes(item));
    count.textContent=(page+1)+' / '+pages.length;count.setAttribute('aria-label','Page '+(page+1)+' of '+pages.length);previous.disabled=page===0;next.disabled=page===pages.length-1;
  }
  return {layout(width,height){roomWidth=width;roomHeight=height;render();}};
}
