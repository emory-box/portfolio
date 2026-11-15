// The original Figma paper turns upright; its original grid stays under the cells.
export function createGameArtwork(art) {
  const turning=[...art.querySelectorAll('.home-game-paper,.home-game-outline,.home-game-shadow,.home-game-fill')];
  const demo=[...art.querySelectorAll('.home-game-demo,.home-game-eraser')];
  const fill=art.querySelector('.home-game-fill');
  const front='rotate(-45deg) scale(1.32)';
  function finish(focused) {
    art.classList.toggle('is-front',focused);
    for(const el of [...turning,...demo]){el.style.transform='';el.style.opacity='';}
  }
  function enter(animate,duration) {
    return [
      ...turning.map(el=>animate(el,[{transform:getComputedStyle(el).transform},{transform:front}],{duration,easing:'cubic-bezier(.3,0,.7,1)'})),
      ...demo.map(el=>animate(el,[{opacity:+getComputedStyle(el).opacity},{opacity:0}],{duration:duration*.5,delay:duration*.2,easing:'ease-out'})),
      animate(fill,[{opacity:+getComputedStyle(fill).opacity},{opacity:1}],{duration:duration*.6,easing:'ease-out'})
    ];
  }
  function freeze() {
    for(const el of [...turning,...demo]){
      const style=getComputedStyle(el);el.style.transform=style.transform;el.style.opacity=style.opacity;
    }
  }
  function exit(animate,duration) {
    return [
      ...turning.map(el=>animate(el,[{transform:getComputedStyle(el).transform},{transform:'rotate(0deg) scale(1)'}],{duration,easing:'cubic-bezier(.3,0,.7,1)'})),
      ...demo.map(el=>animate(el,[{opacity:+getComputedStyle(el).opacity},{opacity:1}],{duration:duration*.4,delay:duration*.6,easing:'ease-out'})),
      animate(fill,[{opacity:+getComputedStyle(fill).opacity},{opacity:0}],{duration,easing:'ease-out'})
    ];
  }
  function inFrontPose(measure) {
    const focused=art.classList.contains('is-front'),elements=[...turning,...demo],styles=elements.map(el=>el.style.cssText);
    finish(true);measure();art.classList.toggle('is-front',focused);
    elements.forEach((el,i)=>el.style.cssText=styles[i]);
  }
  return {enter,exit,freeze,finish,inFrontPose};
}
