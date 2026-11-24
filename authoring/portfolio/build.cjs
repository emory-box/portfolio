// Optional authoring helper. GitHub Pages serves the resulting files directly.
const fs = require('node:fs');
const path = require('node:path');
const {profile, projects} = require('./content.cjs');
const {footer, recommendations, credits, projectVideo} = require('./chrome.cjs');
const root = path.resolve(__dirname, '../..');

function marked(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  return pattern.test(html) ? html.replace(pattern, content) : null;
}

const selectedProject=process.argv.find(arg=>arg.startsWith('--project='))?.slice('--project='.length);
if(!selectedProject){require('./home/neutral-board.cjs')();const homepage = require('./home/index.cjs')();fs.writeFileSync(path.join(root, 'index.html'), homepage);}

for (const project of process.argv.includes('--home-only') ? [] : projects.filter(p=>!selectedProject||p.slug===selectedProject)) {
  const file = path.join(root, 'projects', project.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!/\bid="page-top"/.test(html)) html = html.replace(/<body\b([^>]*)>/, (_, attrs) => '<body' + attrs.replace(/\s+id="top"/, '') + ' id="page-top">');
  if (!html.includes('href="../../assets/css/project-endings.css"')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="../../assets/css/project-endings.css">\n</head>');
  }
  if (project.slug === 'greeny') {
    html = marked(html, 'project-credits', credits()) || html.replace('</main>', credits() + '\n</main>');
  }
  const updatedFooter = marked(html, 'portfolio-footer', footer('../../',project.slug));
  if (updatedFooter) html = updatedFooter;
  else {
    const oldFooter = /<footer class="(?:site-footer|synergy-footer|footer wrap)"[^>]*>[\s\S]*?<\/footer>/;
    if (!oldFooter.test(html)) throw new Error('Project footer not found: ' + project.slug);
    html = html.replace(oldFooter, footer('../../',project.slug));
  }
  html = marked(html, 'project-recommendations', recommendations(project.slug))
    || html.replace('<!-- portfolio-footer:start -->', recommendations(project.slug) + '\n<!-- portfolio-footer:start -->');
  if (project.videoId) {
    html = marked(html, 'project-video', projectVideo(project))
      || html.replace('<!-- project-recommendations:start -->', projectVideo(project) + '\n<!-- project-recommendations:start -->');
    if (!html.includes('src="../../assets/js/project-video.js"')) {
      html = html.replace('</head>', '<script src="../../assets/js/project-video.js" defer></script>\n</head>');
    }
  }
  if(project.slug==='greeny'){
    html=html.replace(/<!-- project-credits:start -->[\s\S]*?<!-- project-credits:end -->\s*/,'');
    html=html.replace('<!-- project-video:end -->',match=>match+'\n'+credits());
  }
  fs.writeFileSync(file, html);
}
console.log(selectedProject ? 'Synchronized '+selectedProject+' ending only; Home and other projects unchanged.' : process.argv.includes('--home-only') ? 'Built home only; project pages unchanged.' : 'Built personal home and synchronized two recommendations + footer on all three projects.');
