const {profile, projects, skills} = require('../content.cjs');
const {esc, arrow, cover} = require('../chrome.cjs');
const assets = require('./assets.cjs');
const butter = require('./butter.cjs');
const pan = require('./pan.cjs');

const svg = (name, extra = '', nodeOverride) => {
  const [width,height,node] = assets[name];
  return `<img src="assets/img/home/${name}" alt="" width="${width}" height="${height}" data-node-id="${nodeOverride||node}" ${extra}>`;
};
const layers = name => `<span class="home-vector home-${name}-art">${[1,2,3].map(i=>svg(`${name}-layer-${i}.svg`)).join('')}</span>`;
const controlIcon = name => svg(`icon-${name}.svg`,'class="home-ui-icon" aria-hidden="true"');
const doodle = name => `<span class="home-arrow home-arrow-${name}" aria-hidden="true">${svg(`arrow-${name}.svg`)}</span>`;
const note = (rules = false) => `<span class="home-note-art" data-art-width="283.8684387207031" data-art-height="250.48464965820312" data-node-id="2767:16179" aria-hidden="true"><span class="home-note-shadow" data-node-id="2767:16180"></span><span class="home-note-face" data-node-id="2767:16181"></span><span class="home-note-tab" data-node-id="2767:16182"></span><span class="home-note-holes">${Array.from({length:9},(_,i)=>svg('note-binding-hole.svg','',`2767:${16183+i}`)).join('')}</span>${rules?'<span class="home-note-rules">'+Array.from({length:9},()=>'<span></span>').join('')+'</span>':''}</span>`;
const aboutCopy = [
  'Design, to me, is about crafting meaningful experiences.',
  'With a background in Electronic Engineering, I bring technical knowledge and systems thinking into UX Design. I aim to bridge technology and human needs, creating experiences that go beyond usability to deliver meaningful impact.'
];
const gameArt = () => `<span class="home-game-art" data-art-width="159.79202270507812" data-art-height="141" data-node-id="2733:16838" aria-hidden="true"><span class="home-game-part home-game-fill"><span></span></span>${['paper','outline','eraser','grid','shadow'].map(part=>`<span class="home-game-part home-game-${part}">${svg(part==='grid'?'game-grid-current.svg':`game-${part}.svg`)}</span>`).join('')}<span class="home-game-part home-game-demo">${svg('game-demo-current.svg')}</span></span>`;
const toastArt = () => `<span class="home-toast-art" data-art-width="1764.5023193359375" data-art-height="1556.9915771484375" data-node-id="2785:16267" aria-hidden="true">${['paper-back','outline','shadow','inner-outline'].map(part=>`<span class="home-toast-rest-part home-toast-${part}">${svg(`toast-${part}.svg`)}</span>`).join('')}<span class="home-toast-focus">${svg('toast-focus.svg')}</span>${['hard','soft'].map(id=>`<span class="home-butter-piece home-butter-${id}">${id==='hard'?butter:''}<span class="home-butter-puddle"></span><span class="home-butter-spread">${svg('toast-butter-spread.svg')}</span><span class="home-butter-vector"><span class="home-butter-shape">${svg('toast-butter-fill.svg')}${svg('toast-butter-outline.svg')}${svg('toast-butter-highlight.svg','class="home-butter-highlight"')}</span></span></span>`).join('')}</span>`;

module.exports = () => `<!doctype html>
<html lang="en" class="home-page"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio — selected design work</title>
<meta name="description" content="Selected UX/UI case studies: Greeny, Moti-Pulse and Synergy.">
<meta name="theme-color" content="#f2f0f3"><link rel="icon" href="data:,">
<link rel="stylesheet" href="assets/css/fonts.css"><link rel="stylesheet" href="assets/css/base.css"><link rel="stylesheet" href="assets/css/home.css">
<link rel="preload" as="image" href="assets/img/home/board-greeny.svg"><link rel="preload" as="image" href="assets/img/home/board-moti.svg"><link rel="preload" as="image" href="assets/img/home/board-synergy.svg"><link rel="preload" as="image" href="assets/img/home/game-x.svg"><link rel="preload" as="image" href="assets/img/home/game-o.svg">
<script src="assets/js/home/index.js" type="module"></script>
</head><body class="theme-home" id="page-top">
<a class="skip-link" href="#main">Skip to content</a>
<header class="home-header"><span class="home-owner">${esc(profile.name)}</span><nav aria-label="Portfolio"><a href="#about">About</a><a href="#work">Projects</a><a href="#contact">Contact</a></nav></header>
<main id="main">
  <section class="home-scene" aria-labelledby="home-title">
    <div class="home-stage" data-node-id="2727:16249">
      <h1 id="home-title" data-node-id="2738:16935">Hello!</h1>
      <a href="#about" class="home-object home-portrait" data-node-id="2727:16258" aria-label="About ${esc(profile.name)}">${layers('avatar')}</a>
      <button type="button" class="home-pan-decoration" aria-label="Flip the egg" disabled data-node-id="2733:16854"><span class="home-vector home-pan-art" aria-hidden="true">${svg('pan.svg')}${pan}</span></button>
      <a href="#skills" class="home-object home-skills home-toast" aria-label="Explore my skills" data-node-id="2727:16463">${toastArt()}<span class="home-object-label">Skills</span></a>
      <a href="#play" class="home-object home-play" data-node-id="2733:16838">${gameArt()}<span class="sr-only">Let’s play tic-tac-toe</span></a>
      <a href="#work" class="home-object home-projects" data-node-id="2754:16258"><span class="home-vector home-pegboard-art">${svg('pegboard-entry.svg')}<span class="home-board-preview">${projects.map((p,i)=>svg(p.homeBoard,`data-board-index="${i}" ${i?'hidden':''}`)).join('')}</span></span><span class="home-object-label">Projects</span></a>
      <a href="#contact" class="home-object home-note" data-node-id="2767:16179">${note(true)}<span class="home-object-label">Send me a note</span></a>
      <button type="button" class="home-ball" aria-label="Bounce the basketball" disabled data-node-id="2738:16942">${svg('ball.svg')}</button>
      ${doodle('up-right')}${doodle('down-right')}${doodle('down-left')}${doodle('left')}
    </div>
  </section>
  <div class="home-panel-area">
    <section id="about" class="home-panel home-about" aria-labelledby="about-title" data-node-id="2748:16339">
      <div class="home-about-card">
        <div class="home-about-art" aria-hidden="true"><span class="home-about-avatar">${[1,2,3].map(i=>svg(`about-avatar-layer-${i}.svg`)).join('')}</span></div>
        <span class="home-about-clip" aria-hidden="true">${svg('paperclip.svg')}</span>
        <div class="home-about-copy"><h2 id="about-title">Hello! I’m Emory</h2>${aboutCopy.map((p,i)=>`<p>${i===0?esc(p).replace('about crafting','about<br class="home-about-lead-break">crafting'):esc(p)}</p>`).join('')}</div>
      </div>
    </section>
    <section id="work" class="home-panel home-work" aria-labelledby="work-title">
      <div class="home-work-layout" data-node-id="2749:16563">
        <div class="home-project-board-surface" data-node-id="2854:23439">${svg('pegboard-projects.svg','class="home-project-board"')}<nav class="home-project-tabs" aria-label="Choose a project">${projects.map((p,i)=>`<a id="project-tab-${p.slug}" class="home-project-tab" href="#project-${p.slug}" data-project-index="${i}"><span class="home-project-hover-art" aria-hidden="true">${svg(p.homeBoard)}</span><span class="home-project-card sr-only">${esc(p.name)}</span></a>`).join('')}</nav></div>
        <div class="home-project-details"><h2 id="work-title" class="sr-only">Projects</h2><div class="home-project-grid">${projects.map(p=>`<article class="home-project-preview" id="project-${p.slug}"><a class="home-project" href="projects/${p.slug}/"><div class="portfolio-cover" role="img" aria-label="${esc(p.name)}${p.homeCover?' cover':' cover placeholder'}">${p.homeCover?`<img src="${p.homeCover}" alt="">`:''}</div><div class="home-project-caption"><h3>${esc(p.name)}</h3></div><p class="home-project-type">${esc(p.type)}</p><p class="home-project-duration">${esc(p.duration)}</p><p class="home-project-summary">${esc(p.homeSummary)}</p><span class="home-project-open">View more ${controlIcon('arrow-up-right')}</span></a></article>`).join('')}</div></div>
      </div>
    </section>
    <section id="skills" class="home-panel home-skills-panel" aria-labelledby="skills-title" data-node-id="2785:16153"><h2 id="skills-title" class="sr-only">Skills</h2><div class="home-skills-stage"><div class="home-skills-art-slot" aria-hidden="true">${svg('toast.svg')}</div><div class="home-skills-groups">${skills.map(group=>`<section class="home-skills-group" data-skill-group="${esc(group.id)}" aria-labelledby="${esc(group.id)}-skills-title"><div class="home-skills-copy"><h3 id="${esc(group.id)}-skills-title">${esc(group.title)}</h3><ul class="home-skill-list" role="list">${group.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div></section>`).join('')}</div></div></section>
    <section id="contact" class="home-panel home-contact" aria-labelledby="contact-title"><div class="home-contact-paper"><div class="home-contact-decoration" aria-hidden="true">${note()}</div><form class="home-contact-content" action="mailto:${esc(profile.email)}" method="get" aria-describedby="contact-send-help"><h2 id="contact-title">Send me a note</h2><div class="home-contact-field"><label for="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" required autocomplete="off"></div><div class="home-contact-field"><label for="contact-message">Message</label><textarea id="contact-message" name="body" rows="4" required></textarea></div><div class="home-contact-actions"><button class="home-contact-send" type="submit">Send ${controlIcon('mail')}</button><p id="contact-send-help" class="sr-only">Opens your email app so you can review and send.</p></div><div class="home-contact-email" id="contact-details"><p>Or copy my email</p><div class="home-contact-email-row"><span id="contact-email" tabindex="-1">${esc(profile.email)}</span><button type="button" class="home-copy-email" aria-label="Copy email" hidden>Copy ${controlIcon('copy')}</button></div></div><p class="home-contact-status" id="contact-status" role="status" aria-live="polite"></p></form></div></section>
    <section id="play" class="home-panel home-game" aria-labelledby="play-title"><h2 id="play-title">Let’s play</h2><p class="home-game-instructions">You’re X. The computer is O.</p><div class="home-game-display"><noscript>${gameArt()}</noscript><div class="home-game-board" aria-label="Tic-tac-toe board">${Array.from({length:9},(_,i)=>`<button type="button" data-cell="${i}" aria-label="Row ${Math.floor(i/3)+1}, column ${i%3+1}: empty" disabled></button>`).join('')}</div></div><div class="home-game-footer"><p id="game-status" class="home-game-status" role="status" aria-live="polite">Your turn.</p><button type="button" class="home-game-reset" disabled>Play Again ${controlIcon('replay')}</button></div><p class="home-nojs">Enable JavaScript to play against the computer.</p></section>
  </div>
</main>
</body></html>`;
