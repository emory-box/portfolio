// Short, repeatable physical gestures; the scene/camera never navigates.
export function initHomeToys(reduced) {
  const root=document.documentElement,pan=document.querySelector('.home-pan-decoration');
  const scene=pan.querySelector('.home-pan-scene'),tool=scene.querySelector('.home-pan-tool');
  const eggs=[...scene.querySelectorAll('.home-pan-egg')],yolks=[...scene.querySelectorAll('.home-pan-yolk')];
  const ball=document.querySelector('.home-ball');
  let panMotions=[],ballMotion=null;
  const prepare=()=>root.classList.add('home-intro-finished');
  function reset() {
    for(const motion of panMotions)motion.cancel();panMotions=[];
    ballMotion?.cancel();ballMotion=null;
    pan.removeAttribute('aria-busy');ball.removeAttribute('aria-busy');
  }
  // The original vector paths are already in this SVG; no external-fragment
  // readiness gate or image handoff can strand the native button on Safari.
  pan.disabled=false;ball.disabled=false;

  pan.addEventListener('click',()=>{
    if(panMotions.length)return;prepare();pan.setAttribute('aria-busy','true');
    const duration=1040;
    const frames=[{transform:'none',offset:0},{transform:'none',offset:.16}];
    const back=[];
    for(let i=0;i<=40;i++){
      const u=i/40,turn=Math.cos(u*Math.PI*2),lift=-4*124*u*(1-u);
      frames.push({transform:`translateY(${lift}px) rotate(${Math.sin(u*Math.PI)*-14}deg) scaleY(${turn})`,offset:.17+u*.66});
      back.push({filter:u>.23&&u<.77?'brightness(0) invert(.972549)':'brightness(1) invert(0)',offset:.17+u*.66});
    }
    frames.push({transform:'translateY(0) scale(1.07,.91)',offset:.87},{transform:'none',offset:.94},{transform:'none',offset:1});
    back.unshift({filter:'brightness(1) invert(0)',offset:0});back.push({filter:'brightness(1) invert(0)',offset:1});
    const motions=reduced.matches?[pan.animate([{opacity:1},{opacity:.6},{opacity:1}],{duration:180})]:[
      tool.animate([{transform:'none',offset:0},{transform:'rotate(-7deg) translateY(3px)',offset:.1},{transform:'rotate(12deg) translateY(-2px)',offset:.2},{transform:'rotate(3deg)',offset:.4},{transform:'rotate(-3deg)',offset:.58},{transform:'none',offset:.75},{transform:'none',offset:1}],{duration,easing:'linear'}),
      scene.querySelector('.home-pan-well').animate([{opacity:0,offset:0},{opacity:0,offset:.16},{opacity:1,offset:.19},{opacity:1,offset:.83},{opacity:0,offset:.92},{opacity:0,offset:1}],{duration,easing:'linear'}),
      ...eggs.map(egg=>egg.animate(frames,{duration,easing:'linear'})),
      ...yolks.map(yolk=>yolk.animate(back,{duration,easing:'linear'}))
    ];
    // All egg pieces use one clock so their outlines/yolk stay attached.
    const start=document.timeline.currentTime;for(const motion of motions)motion.startTime=start;
    panMotions=motions;
    Promise.allSettled(motions.map(m=>m.finished)).then(()=>{if(panMotions===motions){panMotions=[];pan.removeAttribute('aria-busy');}});
  });

  ball.addEventListener('click',()=>{
    if(ballMotion)return;prepare();ball.setAttribute('aria-busy','true');
    const height=Math.min(112,ball.getBoundingClientRect().width*.8);
    let time=0;const poses=[];
    function pose(y,x=1,stretch=1,easing='linear') {poses.push({transform:`translateY(${y}px) scale(${x},${stretch})`,time,easing});}
    function step(ms,y,x=1,stretch=1,easing='linear'){time+=ms;pose(y,x,stretch,easing);}
    pose(0);step(65,0,1.09,.9,'ease-out');step(45,0,.96,1.05);
    function hop(ms,peak,compression,spread) {
      for(let i=1;i<=24;i++){
        const u=i/24,speed=Math.abs(2*u-1);
        step(ms/24,-4*peak*u*(1-u),1-.04*speed,1+.05*speed,i===24?'ease-out':'linear');
      }
      step(40,0,spread,compression,'ease-out');step(45,0);
    }
    hop(520,height,.8,1.17);hop(300,height*.3,.9,1.10);hop(170,height*.075,.96,1.04);
    const motion=ball.animate(reduced.matches?[{opacity:1},{opacity:.6},{opacity:1}]:poses.map(({time:at,...frame})=>({...frame,offset:at/time})),{duration:reduced.matches?180:time,easing:'linear'});
    ballMotion=motion;
    const finish=()=>{if(ballMotion===motion){ballMotion=null;ball.removeAttribute('aria-busy');}};
    motion.finished.then(finish,finish);
  });
  reduced.addEventListener('change',reset);
  return {reset};
}
