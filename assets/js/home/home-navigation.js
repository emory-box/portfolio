// Native page navigation with one travelling original object per view.
import {createAboutReveal} from './home-about.js';
import {createGameArtwork} from './home-game-art.js';
import {createHomeObjects} from './home-objects.js';
import {createNoteArtwork} from './home-note-art.js';
import {createSkillsArtwork} from './home-skills-art.js';
import {createHomeViewFit} from './home-view-fit.js';

export function initHomeNavigation({onPrepare=()=>{},onEnter=()=>{},onLeave=()=>{}}={}) {
  const root=document.documentElement,scene=document.querySelector('.home-scene');
  const stage=scene.querySelector('.home-stage'),header=document.querySelector('.home-header');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),views=new Map(),motions=new Set();
  for(const panel of document.querySelectorAll('.home-panel')) {
    const view=document.createElement('div');view.className='home-view';view.dataset.view=panel.id;
    view.hidden=true;view.inert=true;panel.before(view);view.append(panel);views.set(panel.id,view);
  }
  const objects=createHomeObjects(views),about=createAboutReveal(views.get('about'));
  const game=createGameArtwork(objects.art('play')),note=createNoteArtwork(objects.art('contact'));
  const skills=createSkillsArtwork(objects.art('skills'),views.get('skills'));
  const fitter=createHomeViewFit(views);
  const noteHome=note.capture(),duration=880;
  const extras=new Map([
    ['work',[...document.querySelectorAll('.home-project-tabs,.home-project-details,.home-board-preview')]],
    ['skills',[document.querySelector('.home-skills-copy')]],
    ['contact',[document.querySelector('.home-contact-content')]],
    ['play',[...document.querySelector('.home-game').children].filter(e=>!e.classList.contains('home-game-display')).concat(document.querySelector('.home-game-board'))]
  ]);
  const close=document.createElement('button');close.type='button';close.className='home-return';close.hidden=true;
  const icon=document.createElement('img');icon.className='home-ui-icon';icon.src='assets/img/home/icon-close.svg';icon.width=24;icon.height=24;icon.alt='';icon.setAttribute('aria-hidden','true');
  close.append(document.createTextNode('Close'),icon);close.setAttribute('aria-label','Close and return to home');
  document.querySelector('main').prepend(close);
  let activeId=null,desiredId=null,phase='home',epoch=0,opener=null,homeScroll=0;
  const wait=animations=>Promise.allSettled(animations.map(a=>a.finished));
  function move(element,frames,options) {
    const motion=element.animate(frames,{fill:'forwards',...options});motions.add(motion);return motion;
  }
  function cancelMotion() {for(const motion of motions)motion.cancel();motions.clear();}
  function state(next) {phase=next;root.dataset.homePhase=next;root.dataset.homeView=activeId||'home';}
  function setExtras(id,opacity) {for(const element of extras.get(id)||[])element.style.opacity=opacity;}
  function freezeExtras(id) {for(const element of extras.get(id)||[])element.style.opacity=getComputedStyle(element).opacity;}
  function fadeExtras(id,to,time) {
    return(extras.get(id)||[]).map(element=>move(element,[{opacity:getComputedStyle(element).opacity},{opacity:to}],{duration:time,easing:'ease-out'}));
  }
  function resetStage() {
    stage.style.transform='';stage.style.transformOrigin='';stage.classList.remove('is-focused');header.classList.remove('is-faded');
    for(const element of stage.querySelectorAll('.is-zoom-target'))element.classList.remove('is-zoom-target');
  }
  function showHome() {
    for(const view of views.values()){view.hidden=true;view.inert=true;view.style.opacity='';}
    scene.hidden=false;header.hidden=false;resetStage();window.scrollTo({top:homeScroll,behavior:'instant'});
  }
  function settleHome() {
    cancelMotion();objects.homeAll();note.clear();game.finish(false);skills.finish(false);about.finish();
    for(const id of views.keys())setExtras(id,'');
    showHome();root.classList.remove('home-navigating');scene.inert=false;header.inert=false;
    activeId=desiredId=null;state('home');close.hidden=true;opener?.focus({preventScroll:true});
  }
  function parkInView(id) {
    // Cancel local-coordinate effects and reparent in one synchronous operation.
    cancelMotion();objects.toView(id);note.clear();game.finish(id==='play');
  }
  function settleView(id) {
    cancelMotion();for(const key of views.keys())if(key!==id)objects.toHome(key);
    objects.toView(id);note.clear();game.finish(id==='play');resetStage();about.finish();
    for(const [key,view]of views){view.hidden=key!==id;view.inert=key!==id;view.style.opacity='';setExtras(key,'');}
    scene.hidden=true;scene.inert=true;header.hidden=true;header.inert=true;
    skills.finish(id==='skills');
    fitter.fit(id);if(id==='about')about.measure();
    activeId=desiredId=id;root.classList.remove('home-navigating');state('detail');close.hidden=false;
    close.focus({preventScroll:true});onEnter(id);
  }
  function finishIntro() {
    root.classList.add('home-intro-finished');for(const motion of stage.getAnimations({subtree:true}))motion.cancel();
  }
  function focusRect(home,destination) {
    const scale=Math.max(1.15,Math.min(1.55,innerWidth*.58/home.width,innerHeight*.72/home.height));
    const width=home.width*scale,height=home.height*scale;
    const x=(home.left+home.width/2+destination.left+destination.width/2)/2;
    const y=(home.top+home.height/2+destination.top+destination.height/2)/2;
    return{left:x-width/2,top:y-height/2,width,height};
  }
  function pose(id,focus) {
    stage.classList.add('is-focused');objects.anchor(id).classList.add('is-zoom-target');
    const art=objects.homeRect(id),canvas=stage.getBoundingClientRect(),scale=focus.width/art.width;
    const x=focus.left+focus.width/2,y=focus.top+focus.height/2;
    return'translate('+(x-canvas.left-scale*(art.left-canvas.left+art.width/2))+'px,'+(y-canvas.top-scale*(art.top-canvas.top+art.height/2))+'px) scale('+scale+')';
  }
  function fadeContext(from,to,delay=0) {
    const elements=[...stage.children].filter(e=>!e.classList.contains('is-zoom-target'));
    elements.push(...stage.querySelectorAll('.home-object-label'),header);
    return elements.map(e=>move(e,[{opacity:from},{opacity:to}],{duration:300,delay,easing:'ease-out'}));
  }
  function flightFrames(start,focus,end) {
    const values=r=>[r.left+r.width/2,r.top+r.height/2,r.width,r.height],a=values(start),b=values(focus),c=values(end);
    return Array.from({length:41},(_,i)=>{
      const offset=i/40,first=offset<=.5,u=first?offset*2:(offset-.5)*2,from=first?a:b,to=first?b:c;
      const p=from.map((v,j)=>{const tangent=(c[j]-a[j])*.3;return(2*u**3-3*u**2+1)*v+(u**3-2*u**2+u)*(first?0:tangent)+(-2*u**3+3*u**2)*to[j]+(u**3-u**2)*(first?tangent:0);});
      const frame=objects.frame({left:p[0]-p[2]/2,top:p[1]-p[3]/2,width:p[2],height:p[3]});
      if(objects.carrier().dataset.object!=='contact')delete frame.height;
      return{...frame,offset};
    });
  }
  function measureDestination(id) {
    const view=views.get(id);view.hidden=false;view.classList.add('is-measuring');
    const measured=objects.measure(id,id==='contact'?note.capture:undefined,()=>{
      if(id==='skills')skills.layout();
      if(id==='play')game.inFrontPose(()=>fitter.fit(id));else fitter.fit(id);
    });
    view.hidden=true;view.classList.remove('is-measuring');return measured;
  }
  function clearHash() {if(views.has(location.hash.slice(1)))history.replaceState(null,'',location.pathname+location.search);}

  async function openView(id,trigger,animate=true,updateHistory=true) {
    if(!views.has(id)||desiredId===id)return;
    const token=++epoch,returning=activeId===id&&desiredId===null;
    let origin,fromPaint;
    if(returning) {
      origin=objects.art(id).getBoundingClientRect();fromPaint=id==='contact'?note.capture():null;
      if(id==='play')game.freeze();if(id==='skills')skills.freeze();freezeExtras(id);cancelMotion();desiredId=id;
      if(!objects.carrier()) {
        if(updateHistory&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
        if(id==='skills'&&!reduced.matches){state('melting-butter');await wait(skills.melt(move));if(token!==epoch)return;}
        root.classList.remove('home-navigating');views.get(id).inert=false;state('revealing-content');
        await wait(fadeExtras(id,1,220));if(token===epoch)settleView(id);return;
      }
      objects.carry(id,origin);if(fromPaint)note.apply(fromPaint);
      showHome();
    }else{
      if(activeId){onLeave(activeId);settleHome();}
      activeId=desiredId=id;homeScroll=scrollY;opener=trigger||objects.anchor(id);origin=objects.homeRect(id);
      onPrepare(id);
    }
    finishIntro();close.hidden=false;close.focus({preventScroll:true});
    scene.inert=true;header.inert=true;root.classList.add('home-navigating');
    if(updateHistory&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
    if(!animate||reduced.matches){window.scrollTo({top:0,behavior:'instant'});settleView(id);return;}
    if(id==='about')about.prepare();setExtras(id,'0');
    if(id==='contact'&&returning)note.clear();
    const {rect:destination,paint}=measureDestination(id),focus=focusRect(origin,destination);
    objects.carry(id,origin);if(id==='contact')note.apply(fromPaint||noteHome);
    const camera=pose(id,focus);stage.style.transformOrigin='0 0';header.classList.add('is-faded');state('zooming-in');
    const travel=move(objects.carrier(),flightFrames(origin,focus,destination),{duration,easing:'linear'});
    const parts=id==='contact'?note.morph(fromPaint||noteHome,paint,move,duration):id==='play'?game.enter(move,duration):[];
    const cameraMotion=move(stage,[{transform:'none'},{transform:camera}],{duration:duration/2,easing:'cubic-bezier(.3,0,.7,1)'});
    await wait([cameraMotion,...fadeContext(returning?0:1,0)]);if(token!==epoch)return;
    const view=views.get(id);view.hidden=false;scene.hidden=true;header.hidden=true;window.scrollTo({top:0,behavior:'instant'});state('settling-in');
    await wait([travel,...parts]);if(token!==epoch)return;
    parkInView(id);
    if(id==='skills') {
      state('melting-butter');await wait(skills.melt(move));if(token!==epoch)return;
    }
    if(id==='about') {
      state('revealing-about-frame');await wait(about.frame(move));if(token!==epoch)return;
      root.classList.remove('home-navigating');view.inert=false;state('revealing-about-text');
      await wait(about.revealText(move));if(token!==epoch)return;
    }else{
      state(id==='play'?'revealing-game':'revealing-content');
      root.classList.remove('home-navigating');view.inert=false;
      await wait(fadeExtras(id,1,id==='play'?150:300));if(token!==epoch)return;
    }
    settleView(id);
  }
  async function closeView(updateHistory=true) {
    if(!activeId||desiredId===null)return;
    const token=++epoch,id=activeId;desiredId=null;onLeave(id);if(updateHistory)clearHash();
    if(reduced.matches){settleHome();return;}
    root.classList.add('home-navigating');
    const view=views.get(id),travelling=Boolean(objects.carrier());
    const bounds=objects.art(id).getBoundingClientRect(),paint=id==='contact'?note.capture():null;
    if(id==='about')about.freeze();if(id==='play')game.freeze();if(id==='skills')skills.freeze();freezeExtras(id);cancelMotion();
    if(travelling){objects.carry(id,bounds);if(paint)note.apply(paint);}
    view.inert=true;state('fading-detail');
    if(!travelling) {
      // Lift About's avatar before fading the card around it. Other objects stay
      // in their slot while only their associated content fades.
      if(id==='about')objects.carry(id,bounds);
      const fade=id==='about'?[move(view.querySelector('.home-about-card'),[{opacity:1},{opacity:0}],{duration:220,easing:'ease-out'})]:fadeExtras(id,0,220);
      await wait(fade);if(token!==epoch)return;
      if(id==='skills'&&!reduced.matches){state('gathering-butter');await wait(skills.gather(move));if(token!==epoch)return;}
    }
    if(!objects.carrier()){objects.carry(id,bounds);if(paint)note.apply(paint);}
    showHome();scene.inert=true;header.inert=true;
    const destination=objects.homeRect(id);
    const focus={left:(bounds.left+destination.left)/2,top:(bounds.top+destination.top)/2,width:(bounds.width+destination.width)/2,height:(bounds.height+destination.height)/2};
    const camera=pose(id,focusRect(destination,bounds));
    stage.style.transformOrigin='0 0';stage.style.transform=camera;header.classList.add('is-faded');state('zooming-out');
    const travel=move(objects.carrier(),flightFrames(bounds,focus,destination),{duration,easing:'linear'});
    const parts=id==='contact'?note.morph(paint,noteHome,move,duration):id==='play'?game.exit(move,duration):[];
    const cameraMotion=move(stage,[{transform:camera},{transform:'none'}],{duration,easing:'cubic-bezier(.3,0,.7,1)'});
    await wait([travel,cameraMotion,...parts,...fadeContext(0,1,duration*.45)]);if(token===epoch)settleHome();
  }
  close.addEventListener('click',()=>closeView());
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&activeId){e.preventDefault();closeView();}});
  document.addEventListener('click',e=>{
    const link=e.target.closest('a[href^="#"]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button)return;
    const id=link.hash.slice(1);if(!views.has(id))return;e.preventDefault();openView(id,link);
  });
  function syncHash(initial=false) {
    const id=location.hash.slice(1);if(views.has(id)){if(desiredId!==id)openView(id,null,!initial,false);}else if(desiredId!==null)closeView(false);
  }
  addEventListener('popstate',()=>syncHash());addEventListener('hashchange',()=>syncHash());
  function settleChangingEnvironment() {
    if(phase==='home')return;
    if(phase==='detail'){if(activeId==='skills')skills.finish(true);else fitter.fit(activeId);if(activeId==='about')about.measure();return;}
    ++epoch;const id=desiredId;if(id)settleView(id);else settleHome();
  }
  addEventListener('resize',settleChangingEnvironment,{passive:true});reduced.addEventListener('change',settleChangingEnvironment);
  state('home');syncHash(true);
}
