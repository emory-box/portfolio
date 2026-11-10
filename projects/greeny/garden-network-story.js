// Swap the final scene's copy without moving its garden or network diagram.
const clamp=n=>Math.min(1,Math.max(0,n));
export function createGardenNetworkStory(step) {
  const hub=step.querySelector('[data-network-copy="hub"]');
  const app=step.querySelector('[data-network-copy="app"]');
  const modes=[...step.querySelectorAll('[data-app-copy]')];
  const hint=step.querySelector('.garden-network-hint');
  const names=['hub',...modes.map(mode=>mode.dataset.appCopy)];
  let enabled=false;
  function show(element,opacity,readable) {
    element.style.opacity=opacity;
    element.style.visibility=opacity>0?'visible':'hidden';
    element.inert=!readable;
    element.setAttribute('aria-hidden',String(!readable));
  }
  function update(progress) {
    if(!enabled)return;
    const position=Math.min(modes.length,Math.max(0,progress));
    const first=Math.floor(position),next=Math.min(first+1,modes.length);
    const t=clamp((position-first-.08)/.24),blend=t*t*(3-2*t);
    const weights=Array(names.length).fill(0);weights[first]=1-blend;weights[next]+=blend;
    const selected=blend<.5?first:next,appOpacity=1-weights[0];
    show(hub,weights[0],selected===0);
    show(app,appOpacity,selected!==0);
    modes.forEach((mode,i)=>show(mode,appOpacity?weights[i+1]/appOpacity:0,selected===i+1));
    step.dataset.networkPhase=names[selected];
    step.setAttribute('aria-labelledby',selected===0?'garden-connect-title':'garden-remote-title');
    hint.textContent=selected===modes.length?'Scroll to the case study':'Scroll to continue';
  }
  function prepare(animate) {
    enabled=animate;step.classList.toggle('has-network-story',enabled);
    if(enabled){update(0);return;}
    for(const element of [hub,app,...modes]){
      element.style.removeProperty('opacity');element.style.removeProperty('visibility');
      element.inert=false;element.removeAttribute('aria-hidden');
    }
    delete step.dataset.networkPhase;
    step.setAttribute('aria-labelledby','garden-connect-title garden-remote-title');
  }
  return {prepare,update,get enabled(){return enabled;},get beats(){return modes.length;}};
}
