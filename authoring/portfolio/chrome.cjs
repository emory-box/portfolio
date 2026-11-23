const {profile, projects} = require('./content.cjs');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const backToTop = '<a class="portfolio-back-to-top" href="#page-top"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21V3M4 11l8-8 8 8"/></svg><span>Back to top</span></a>';
const cover = (label, source, prefix = '') => source
  ? `<div class="portfolio-cover"><img src="${esc(prefix + source)}" alt="${esc(label)}" loading="lazy" width="1600" height="1000"></div>`
  : `<div class="portfolio-cover" role="img" aria-label="${esc(label)} image placeholder"><span>Image to add</span></div>`;
function footer(prefix = '', projectSlug = '') {
  const email = profile.email ? `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>` : '<span class="portfolio-placeholder">[Your email]</span>';
  const linkedin = profile.linkedin ? `<a href="${esc(profile.linkedin)}">${projectSlug==='greeny'?'linkedin.com/in/thanh-pham-indabox':'LinkedIn'}</a>` : '<span class="portfolio-placeholder">[LinkedIn profile]</span>';
  return `<!-- portfolio-footer:start -->
<footer class="site-footer portfolio-footer"><div class="wrap">
  <div class="portfolio-footer-grid">
    <div><p class="portfolio-footer-name">${esc(profile.name)}</p><p class="portfolio-footer-role">${esc(profile.role)}</p></div>${projectSlug==='greeny'?'':`\n    <nav aria-label="Portfolio"><a href="${prefix}index.html#work">Work</a><a href="${prefix}index.html#about">About</a><a href="${prefix}index.html#contact">Contact</a></nav>`}
    <div class="portfolio-footer-contact">${email}<div>${linkedin}</div></div>
  </div>
  <div class="portfolio-footer-bottom"><small>© ${new Date().getFullYear()} ${esc(profile.name)}</small></div>
</div></footer>
<!-- portfolio-footer:end -->`;
}
function projectVideo(project) {
  return `<!-- project-video:start -->
<section class="project-video" id="project-video" aria-labelledby="project-video-title"><div class="wrap">
  <h2 id="project-video-title">Project video</h2>
  <div class="project-video-frame" data-project-video="${esc(project.videoId)}" data-video-title="${esc(project.name)} project video">
    <img src="../../${esc(project.cover)}" alt="" width="1600" height="900" loading="lazy">
    <button class="project-video-play" type="button" aria-label="Play ${esc(project.name)} project video" hidden><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m8 5 11 7-11 7Z"/></svg><span>Play video</span></button>
    <noscript><a class="project-video-play" href="https://www.youtube.com/watch?v=${esc(project.videoId)}" target="_blank" rel="noopener" aria-label="Play ${esc(project.name)} project video on YouTube">Play video</a></noscript>
  </div>
</div></section>
<!-- project-video:end -->`;
}
function recommendations(slug) {
  return `<!-- project-recommendations:start -->
<div class="portfolio-return-top">${backToTop}</div>
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
  <h2 id="project-credits-title" class="sr-only">Project credits</h2><div class="project-credits-grid">
    <div><h3>Team</h3><p>Tấn Duy · Phương Thanh · Kim Vi · Minh Hiển</p></div>
    <div><h3>Guidance</h3><p>Trần Cường Tiến — Instructor</p></div>
  </div>
</div></aside>
<!-- project-credits:end -->`;
}
function homeFooter() {
  const email = profile.email ? `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>` : '<span class="portfolio-placeholder">[Your email]</span>';
  const linkedin = profile.linkedin ? `<a href="${esc(profile.linkedin)}">LinkedIn</a>` : '<span class="portfolio-placeholder">[LinkedIn profile]</span>';
  return `<footer class="home-footer"><div class="wrap">
  <div class="home-footer-links"><nav aria-label="Portfolio"><h2>Info</h2><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div id="contact-details" tabindex="-1"><h2>Contact &amp; social</h2>${email}${linkedin}</div></div>
  <div class="home-footer-bottom"><p class="home-footer-name">${esc(profile.name)}</p><div><p>${esc(profile.role)}</p><small>© ${new Date().getFullYear()} ${esc(profile.name)}</small>${backToTop}</div></div>
</div></footer>`;
}
module.exports = {esc, arrow, cover, footer, homeFooter, recommendations, credits, projectVideo};
