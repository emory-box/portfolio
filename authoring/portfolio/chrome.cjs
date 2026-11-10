const {profile, projects} = require('./content.cjs');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const cover = (label, source, prefix = '') => source
  ? `<div class="portfolio-cover"><img src="${esc(prefix + source)}" alt="${esc(label)}" loading="lazy" width="1600" height="1000"></div>`
  : `<div class="portfolio-cover" role="img" aria-label="${esc(label)} image placeholder"><span>Image to add</span></div>`;
function footer(prefix = '') {
  const email = profile.email ? `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>` : '<span class="portfolio-placeholder">[Your email]</span>';
  const linkedin = profile.linkedin ? `<a href="${esc(profile.linkedin)}">LinkedIn</a>` : '<span class="portfolio-placeholder">[LinkedIn profile]</span>';
  const cvURL = profile.cv && (/^https?:\/\//.test(profile.cv) ? profile.cv : prefix + profile.cv);
  const cv = cvURL ? `<a href="${esc(cvURL)}">CV</a>` : '<span class="portfolio-placeholder">[CV to add]</span>';
  return `<!-- portfolio-footer:start -->
<footer class="site-footer portfolio-footer"><div class="wrap">
  <div class="portfolio-footer-grid">
    <div><p class="portfolio-footer-name">${esc(profile.name)}</p><p class="portfolio-footer-role">${esc(profile.role)}</p></div>
    <nav aria-label="Portfolio"><a href="${prefix}index.html#work">Work</a><a href="${prefix}index.html#about">About</a><a href="${prefix}index.html#contact">Contact</a></nav>
    <div class="portfolio-footer-contact">${email}<div>${linkedin}${cv}</div></div>
  </div>
  <div class="portfolio-footer-bottom"><small>© ${new Date().getFullYear()} ${esc(profile.name)}</small><a href="#page-top">Back to top ${arrow}</a></div>
</div></footer>
<!-- portfolio-footer:end -->`;
}
function recommendations(slug) {
  return `<!-- project-recommendations:start -->
<nav class="project-next" aria-labelledby="next-projects-title"><div class="wrap">
  <div class="project-next-heading"><h2 id="next-projects-title">Next projects</h2><a class="project-next-all" href="../../index.html#work">All projects ${arrow}</a></div>
  <div class="project-next-grid">${projects.filter(p => p.slug !== slug).slice(0,2).map(p => `
    <a class="project-next-card" href="../${p.slug}/">${cover(p.name + ' cover', p.cover, '../../')}<div class="project-next-caption"><h3>${esc(p.name)}</h3>${arrow}</div><p>${esc(p.type)}</p></a>`).join('')}
  </div>
</div></nav>
<!-- project-recommendations:end -->`;
}
function credits() {
  return `<!-- project-credits:start -->
<aside class="project-credits" aria-labelledby="project-credits-title"><div class="wrap">
  <h2 id="project-credits-title">Project credits</h2><div class="project-credits-grid">
    <div><h3>Team</h3><ul><li>Tấn Duy</li><li>Phương Thanh</li><li>Kim Vi</li><li>Minh Hiển</li></ul></div>
    <div><h3>Guidance</h3><p>Trần Cường Tiến<br>Instructor</p></div>
    <div><p>A smart garden companion.<br>A student UX case study.</p><details><summary>About this build</summary><p>Research, diagrams and interface components are rebuilt in HTML, CSS and SVG. Mockups and photography come from the original case-study materials.</p></details></div>
  </div>
</div></aside>
<!-- project-credits:end -->`;
}
function homeFooter() {
  const email = profile.email ? `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>` : '<span class="portfolio-placeholder">[Your email]</span>';
  const linkedin = profile.linkedin ? `<a href="${esc(profile.linkedin)}">LinkedIn</a>` : '<span class="portfolio-placeholder">[LinkedIn profile]</span>';
  const cv = profile.cv ? `<a href="${esc(profile.cv)}">CV</a>` : '<span class="portfolio-placeholder">[CV to add]</span>';
  return `<footer class="home-footer"><div class="wrap">
  <div class="home-footer-links"><nav aria-label="Portfolio"><h2>Info</h2><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div id="contact-details" tabindex="-1"><h2>Contact &amp; social</h2>${email}${linkedin}${cv}</div></div>
  <div class="home-footer-bottom"><p class="home-footer-name">${esc(profile.name)}</p><div><p>${esc(profile.role)}</p><small>© ${new Date().getFullYear()} ${esc(profile.name)}</small><a href="#page-top">Back to top ${arrow}</a></div></div>
</div></footer>`;
}
module.exports = {esc, arrow, cover, footer, homeFooter, recommendations, credits};
