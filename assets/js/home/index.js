import {computerMove, result} from './tic-tac-toe.js';
import {initHomeNavigation} from './home-navigation.js';
import {initHomeContact} from './home-contact.js';
import {initHomeToys} from './home-toys.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let gameTimer = 0;
let board = Array(9).fill('');
let turn = 'X';
const cells = [...document.querySelectorAll('[data-cell]')];
const gameStatus = document.querySelector('#game-status');
const resetButton = document.querySelector('.home-game-reset');

function renderGame() {
  const end = result(board);
  cells.forEach((cell, i) => {
    cell.replaceChildren();
    if(board[i]) {
      const image=document.createElement('img'),text=document.createElement('span');
      image.src='assets/img/home/game-'+board[i].toLowerCase()+'.svg';image.alt='';
      image.width=board[i]==='X'?16.8649:13.4838;image.height=board[i]==='X'?17.9678:13.6543;
      text.className='sr-only';text.textContent=board[i];text.setAttribute('aria-hidden','true');
      cell.append(image,text);
    }
    cell.dataset.value = board[i];
    cell.disabled = Boolean(board[i] || end || turn === 'O');
    cell.classList.toggle('is-winning', Boolean(end?.line.includes(i)));
    cell.setAttribute('aria-label', 'Row '+(Math.floor(i/3)+1)+', column '+(i%3+1)+': '+(board[i]||'empty'));
  });
  document.querySelector('.home-game-board').setAttribute('aria-busy', String(!end && turn === 'O'));
  gameStatus.textContent = end ? end.winner === 'draw' ? 'A draw. Play again?' : end.winner === 'X' ? 'You win! Play again?' : 'The computer wins. Try again?' : turn === 'X' ? 'Your turn.' : 'Computer is thinking...';
}
function computerTurn() {
  clearTimeout(gameTimer);
  if (turn !== 'O' || result(board)) return;
  gameTimer = setTimeout(() => {
    const move = computerMove(board);
    if (move !== null) board[move] = 'O';
    turn = 'X'; renderGame();
  }, 400);
}
function resetGame() {
  clearTimeout(gameTimer); board=Array(9).fill(''); turn='X'; renderGame();
}
cells.forEach((cell,i) => cell.addEventListener('click', () => {
  if (turn !== 'X' || board[i] || result(board)) return;
  board[i]='X'; turn='O'; renderGame(); computerTurn();
}));
resetButton.disabled=false;
resetButton.addEventListener('click', resetGame);
renderGame();

const projectTabs=[...document.querySelectorAll('[data-project-index]')];
const projectPreviews=[...document.querySelectorAll('.home-project-preview')];
const projectTabList=document.querySelector('.home-project-tabs');
let selectedProject=0;
let projectSelectionVersion=0;
projectTabList.setAttribute('role','tablist');
projectTabList.setAttribute('aria-orientation','vertical');
function cancelProjectFeedback() {
  projectSelectionVersion++;
  for(const tab of projectTabs)for(const animation of tab.querySelector('.home-project-hover-art').getAnimations())animation.cancel();
}
function selectProject(index, focus=false, animate=true) {
  cancelProjectFeedback();
  selectedProject=index;
  projectTabs.forEach((tab,i)=>{
    tab.setAttribute('aria-selected',String(i===index));
    tab.tabIndex=i===index?0:-1;
    projectPreviews[i].hidden=i!==index;
    projectPreviews[i].inert=i!==index;
    projectPreviews[i].setAttribute('aria-hidden',String(i!==index));
    document.querySelector(`[data-board-index="${i}"]`).hidden=i!==index;
  });
  if(focus)projectTabs[index].focus({preventScroll:true});
  if(animate&&!reduced.matches) {
    for(const animation of projectPreviews[index].getAnimations())animation.cancel();
    projectPreviews[index].animate([{opacity:.25},{opacity:1}],{duration:150,easing:'ease-out'});
  }
}
projectTabs.forEach((tab,i)=>{
  tab.setAttribute('role','tab');
  tab.setAttribute('aria-controls',projectPreviews[i].id);
  projectPreviews[i].setAttribute('role','tabpanel');
  projectPreviews[i].setAttribute('aria-labelledby',tab.id);
  projectPreviews[i].tabIndex=0;
  tab.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button)return;
    cancelProjectFeedback();
    event.preventDefault();
    const version=projectSelectionVersion;
    const feedback=tab.querySelector('.home-project-hover-art');
    const flash=feedback.animate([{opacity:1,filter:'brightness(1.25)'},{opacity:1,filter:'brightness(1)'}],{duration:220,easing:'ease-out'});
    flash.finished.then(()=>{
      const view=tab.closest('.home-view');
      if(version===projectSelectionVersion&&!view.inert&&!view.hidden)selectProject(i);
    },()=>{});
  });
  tab.addEventListener('keydown',event=>{
    const next=event.key==='ArrowDown'?(selectedProject+1)%projectTabs.length:event.key==='ArrowUp'?(selectedProject+projectTabs.length-1)%projectTabs.length:event.key==='Home'?0:event.key==='End'?projectTabs.length-1:null;
    if(next===null||event.ctrlKey||event.metaKey||event.altKey)return;
    event.preventDefault();selectProject(next,true);
  });
});
selectProject(0,false,false);

const toys=initHomeToys(reduced);
root.classList.add('home-ready');
initHomeContact();
initHomeNavigation({onEnter:id=>{toys.reset();if(id==='play'){renderGame();computerTurn();}},onLeave:()=>{clearTimeout(gameTimer);cancelProjectFeedback();}});
