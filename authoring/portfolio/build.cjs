// Optional authoring helper. GitHub Pages serves the resulting files directly.
const fs = require('node:fs');
const path = require('node:path');
const {profile, projects} = require('./content.cjs');
const {esc, arrow, cover, footer, homeFooter, recommendations, credits} = require('./chrome.cjs');
const root = path.resolve(__dirname, '../..');

function marked(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  return pattern.test(html) ? html.replace(pattern, content) : null;
}

const homepage = `<!doctype html>
<html lang="en" class="home-page"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio — selected design work</title>
<meta name="description" content="Selected UX/UI case studies: Greeny, Moti-Pulse and Synergy.">
<meta name="theme-color" content="#121314">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/home.css">
<link rel="stylesheet" href="assets/css/project-endings.css">
<script src="assets/js/home.js" defer></script>
</head><body class="theme-home" id="page-top">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header home-header"><div class="home-header-inner"><div class="brand home-brand"><span class="sr-only">${esc(profile.name)}</span><span class="home-brand-full" aria-hidden="true">${esc(profile.name)}</span><span class="home-brand-short" aria-hidden="true">${esc(profile.shortName || profile.name)}</span></div><nav class="home-nav" id="home-navigation" aria-label="Main navigation"><div class="home-nav-main"><a href="#work">Work</a><a href="#about">About</a></div><a href="#contact">Contact</a></nav><button class="home-menu-toggle" type="button" aria-controls="home-navigation" aria-expanded="false" hidden>Menu</button></div></header>
<main id="main">
  <section class="home-hero" aria-labelledby="home-title"><div class="home-hero-media">${cover('Hero', profile.heroImage)}</div><div class="home-hero-caption"><h1 id="home-title"><span>Thoughtful design.</span><span>Useful experiences.</span></h1><a class="home-action" href="#featured">Scroll <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a></div></section>
  <section class="home-feature-story" id="featured" aria-labelledby="featured-title"><h2 id="featured-title" class="sr-only">Featured projects</h2>${projects.slice(0,2).map((p,i) => `<a class="home-feature" href="projects/${p.slug}/"><div class="home-feature-frame"><div class="home-feature-media">${cover(p.name + ' feature',p.cover)}</div><div class="home-feature-caption"><span>${i+1}</span><div><h3>${esc(p.name)}</h3><p>${esc(p.type)}</p></div>${arrow}</div></div></a>`).join('')}</section>
  <section class="home-about wrap" id="about" aria-labelledby="about-title"><h2 id="about-title" class="sr-only">About me</h2><p class="home-bio">${profile.biography.join(' ').split(/\s+/).map(word => `<span class="home-bio-word">${esc(word)}</span>`).join(' ')}</p><details class="home-profile-details"><summary>More about me</summary><div class="home-profile-content"><div class="home-portrait">${cover('Portrait', profile.portrait)}</div><div><p>${esc(profile.introduction)}</p><div class="home-profile-links">${profile.cv ? `<a href="${esc(profile.cv)}">Read my CV ${arrow}</a>` : '<span class="portfolio-placeholder">[CV to add]</span>'}${profile.linkedin ? `<a href="${esc(profile.linkedin)}">LinkedIn ${arrow}</a>` : '<span class="portfolio-placeholder">[LinkedIn profile]</span>'}</div></div></div></details><p class="home-draft-note">Draft profile: personal copy, bracketed details and grey images are placeholders.</p></section>
  <section class="home-work wrap" id="work" aria-labelledby="work-title"><div class="home-section-heading"><h2 id="work-title">Work</h2><p aria-label="${projects.length} projects">(${projects.length})</p></div><div class="home-project-grid">
${projects.map(p => `    <a class="home-project" href="projects/${p.slug}/" data-home-reveal>${cover(p.name + ' cover', p.cover)}<div class="home-project-caption"><h3>${esc(p.name)}</h3>${arrow}</div><div class="home-project-meta"><span>${esc(p.type)}</span><span>${esc(p.duration)}</span></div><p class="home-project-description">${esc(p.description)}</p></a>`).join('\n')}
  </div></section>
  <section class="home-contact wrap" id="contact" aria-labelledby="contact-title"><a class="home-contact-link" href="${profile.email ? 'mailto:' + esc(profile.email) : '#contact-details'}"><h2 id="contact-title">Let’s make something useful.</h2>${arrow}</a><p>For opportunities, collaborations or a conversation.</p></section>
</main>
${homeFooter()}
</body></html>
`;
fs.writeFileSync(path.join(root, 'index.html'), homepage);

for (const project of process.argv.includes('--home-only') ? [] : projects) {
  const file = path.join(root, 'projects', project.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!/\bid="page-top"/.test(html)) html = html.replace(/<body\b([^>]*)>/, (_, attrs) => '<body' + attrs.replace(/\s+id="top"/, '') + ' id="page-top">');
  if (!html.includes('href="../../assets/css/project-endings.css"')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="../../assets/css/project-endings.css">\n</head>');
  }
  if (project.slug === 'greeny') {
    html = marked(html, 'project-credits', credits()) || html.replace('</main>', credits() + '\n</main>');
  }
  const updatedFooter = marked(html, 'portfolio-footer', footer('../../'));
  if (updatedFooter) html = updatedFooter;
  else {
    const oldFooter = /<footer class="(?:site-footer|synergy-footer|footer wrap)"[^>]*>[\s\S]*?<\/footer>/;
    if (!oldFooter.test(html)) throw new Error('Project footer not found: ' + project.slug);
    html = html.replace(oldFooter, footer('../../'));
  }
  html = marked(html, 'project-recommendations', recommendations(project.slug))
    || html.replace('<!-- portfolio-footer:start -->', recommendations(project.slug) + '\n<!-- portfolio-footer:start -->');
  fs.writeFileSync(file, html);
}
console.log(process.argv.includes('--home-only') ? 'Built home only; project pages unchanged.' : 'Built personal home and synchronized two recommendations + footer on all three projects.');
