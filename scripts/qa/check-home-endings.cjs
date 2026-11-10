const assert = require('node:assert/strict');
const fs = require('node:fs');
const {puppeteer, chromePath} = require('./browser-runtime.cjs').browserRuntime();
const {projects} = require('../../authoring/portfolio/content.cjs');
const SITE = process.env.SITE_URL || 'http://localhost:4317';
const out = '.cache/qa/home-endings';
fs.mkdirSync(out, {recursive: true});

(async () => {
  const browser = await puppeteer.launch({executablePath: chromePath, headless: true,
    pipe: true, args: ['--no-sandbox', '--disable-webgl']});
  try {
    const page = await browser.newPage(), errors = [], missing = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
    page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith(SITE + '/')) external.push(request.url()); });
    for (const width of [360, 768, 1280, 1920]) {
      await page.setViewport({width, height: 900});
      await page.goto(SITE + '/', {waitUntil: 'networkidle0'});
      assert.deepEqual(await page.$$eval('.home-project', els => els.map(el => el.getAttribute('href'))), projects.map(p => 'projects/' + p.slug + '/'));
      assert.equal(await page.$$eval('.home-work .portfolio-cover', els => els.length), 3);
      assert.equal(await page.$$eval('.home-portrait .portfolio-cover', els => els.length), 1);
      assert(await page.$eval('.home-draft-note', el => el.textContent.includes('placeholders')));
      assert.equal(await page.$$eval('a[href=""],a[href="#"],a[href*="example.com"],a[href*="undefined"]', els => els.length), 0, 'No fake/dead contact links');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Home fits ' + width);
      for (const anchor of ['work', 'about', 'contact']) assert.equal(await page.$$eval('[id="' + anchor + '"]', els => els.length), 1);
      await page.screenshot({path: out + '/home-' + width + '.png', fullPage: true});
      if (width === 1280) {
        await page.setViewport({width, height: 800});
        assert(await page.$eval('.home-action', el => el.getBoundingClientRect().bottom <= innerHeight), 'Hero primary action is above fold');
        await page.focus('.home-action');
        assert(await page.$eval('.home-action', el => getComputedStyle(el).outlineStyle !== 'none'), 'Visible keyboard focus');
        await page.setViewport({width, height: 900});
      }
      for (const project of projects) {
        await page.goto(SITE + '/projects/' + project.slug + '/', {waitUntil: 'networkidle0'});
        const expected = projects.filter(p => p.slug !== project.slug).map(p => '../' + p.slug + '/');
        assert.deepEqual(await page.$$eval('.project-next-card', els => els.map(el => el.getAttribute('href'))), expected, 'Recommendations exclude current project');
        assert.equal(await page.$$eval('.portfolio-footer', els => els.length), 1, 'Single personal footer');
        assert.equal(await page.$$eval('#page-top', els => els.length), 1, 'Back to top has a genuine page-start target');
        assert(await page.$eval('.project-next', el => !el.closest('main[data-stack],.greeny-case-study')), 'Ending stays outside protected case-study groups');
        if (project.slug === 'greeny') {
          assert.equal(await page.$$eval('.project-credits li', els => els.length), 4, 'All team credits retained');
          assert(await page.$eval('.project-credits', el => el.textContent.includes('Trần Cường Tiến')), 'Guidance credit retained');
        }
        await page.$eval('.project-next', el => el.scrollIntoView({block: 'start', behavior: 'instant'}));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Project ending fits ' + project.slug + '/' + width);
        assert(await page.$eval('.project-next', el => el.getBoundingClientRect().bottom <= document.querySelector('.portfolio-footer').getBoundingClientRect().top + 1), 'Recommendations precede footer');
        await page.screenshot({path: out + '/' + project.slug + '-' + width + '.png'});
        await page.$eval('.portfolio-footer', el => el.scrollIntoView({block: 'end', behavior: 'instant'}));
        assert(await page.$eval('.portfolio-footer-bottom a', el => {
          const r = el.getBoundingClientRect();
          return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
        }), 'Floating Contents does not obstruct footer action');
        if (width === 360) {
          await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
          assert(await page.$$eval('.project-next,.portfolio-footer', els => els.every(el => el.scrollWidth <= el.clientWidth + 1)), 'New ending fits enlarged text');
          await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
        }
      }
      console.log('PASS home and all three project endings at ' + width + 'px');
    }
    await page.goto(SITE + '/', {waitUntil: 'networkidle0'});
    await page.focus('.home-project');await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.pathname.endsWith('/projects/greeny/'));
    await page.focus('.project-next-card');await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.pathname.endsWith('/projects/moti-pulse/'));
    await page.setJavaScriptEnabled(false);
    await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
    await page.setViewport({width: 360, height: 900});
    await page.goto(SITE + '/', {waitUntil: 'networkidle0'});
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Home fits 200% text without JS');
    assert.equal(await page.$$eval('.home-project', els => els.length), 3);
    assert.deepEqual(errors, []);assert.deepEqual(missing, []);assert.deepEqual(external, []);
    console.log('PASS keyboard project journey, placeholder honesty, no-script, reduced motion, 200% text and local delivery.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
