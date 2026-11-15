// Optional authoring helper. GitHub Pages serves the resulting files directly.
const fs = require('node:fs');
const path = require('node:path');
const {profile, projects} = require('./content.cjs');
const {footer, recommendations, credits} = require('./chrome.cjs');
const root = path.resolve(__dirname, '../..');

function marked(html, name, content) {
  const pattern = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
  return pattern.test(html) ? html.replace(pattern, content) : null;
}

const homepage = require('./home/index.cjs')();
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
