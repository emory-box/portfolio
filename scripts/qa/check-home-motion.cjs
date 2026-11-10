const assert = require('node:assert/strict');
const fs = require('node:fs');
const {puppeteer, chromePath} = require('./browser-runtime.cjs').browserRuntime();
const site = process.env.SITE_URL || 'http://localhost:4317';
const out = '.cache/qa/home-reference';
fs.mkdirSync(out, {recursive: true});
const settle = () => new Promise(resolve => setTimeout(resolve, 350));
(async () => {
  const browser = await puppeteer.launch({executablePath: chromePath, headless: true,
    pipe: true, args: ['--no-sandbox', '--disable-webgl']});
  try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const width of [360, 768, 1280, 1920]) {
      await page.setViewport({width, height: 900});
      await page.goto(site, {waitUntil: 'networkidle0'});
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.$eval('.home-hero', e => Math.round(e.getBoundingClientRect().height)), 900);
      assert(await page.$eval('.home-brand .sr-only', e => e.getBoundingClientRect().width === 1));
      await page.screenshot({path: `${out}/hero-${width}.png`});
      if (width === 360) {
        await page.click('.home-menu-toggle');
        assert(await page.$eval('main', e => e.inert));
        assert.equal(await page.$eval('.home-menu-toggle', e => e.getAttribute('aria-expanded')), 'true');
        await page.screenshot({path: `${out}/mobile-menu.png`});
        await page.keyboard.press('Escape');
        assert(await page.$eval('.home-menu-toggle', e => e === document.activeElement));
        assert(!(await page.$eval('main', e => e.inert)));
        await page.click('.home-menu-toggle');
        await page.click('.home-nav a[href="#about"]');
        assert.equal(await page.evaluate(() => location.hash), '#about');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'about');
        assert.equal(await page.$eval('.home-menu-toggle', e => e.getAttribute('aria-expanded')), 'false');
      }
    }
    await page.setViewport({width: 1440, height: 1000});
    await page.goto(site, {waitUntil: 'networkidle0'});
    const dim = await page.$eval('.home-bio-word', e => getComputedStyle(e).color);
    await page.evaluate(() => scrollTo({top: 2100, behavior: 'instant'}));
    await settle();
    const frames = await page.$$eval('.home-feature-frame', es => es.map(e => ({top:e.getBoundingClientRect().top,width:e.getBoundingClientRect().width})));
    assert(frames.every(f => f.width < 1440 && f.top > -100 && f.top < 300), 'Both shrinking scenes overlap in viewport');
    assert(await page.$eval('.home-header', e => e.classList.contains('is-scrolled')));
    await page.screenshot({path: `${out}/features.png`});
    await page.$eval('.home-bio', e => scrollTo({top: e.getBoundingClientRect().bottom + scrollY - 180, behavior:'instant'}));
    await settle();
    const bright = await page.$eval('.home-bio-word', e => getComputedStyle(e).color);
    assert.notEqual(dim, bright, 'Bio responds to reading progress');
    await page.screenshot({path: `${out}/biography.png`});
    await page.evaluate(() => scrollTo({top:0,behavior:'instant'})); await settle();
    assert.equal(await page.$eval('.home-bio-word', e => getComputedStyle(e).color), dim, 'Highlight reverses on upward scroll');
    await page.focus('.home-project');
    assert(!(await page.$eval('.home-project', e => e.classList.contains('is-pending'))), 'Focus reveals immediately');
    await page.$eval('.home-work', e => e.scrollIntoView({behavior:'instant',block:'start'}));
    await settle();
    await page.screenshot({path: `${out}/work.png`});
    await page.evaluate(() => scrollTo({top:0,behavior:'instant'})); await settle();
    await page.setViewport({width:1440,height:450}); await settle();
    assert(!(await page.$eval('.home-project', e => e.classList.contains('is-pending'))), 'Revealed cards stay visible after returning upward and resizing');
    assert(!(await page.evaluate(() => document.documentElement.classList.contains('home-stack'))), 'Short screens have no pinning');
    await page.setViewport({width:1440,height:1000});
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await settle();
    assert(!(await page.evaluate(() => document.documentElement.classList.contains('home-stack'))));
    assert(await page.$$eval('.home-project', es => es.every(e => getComputedStyle(e).opacity === '1')));
    await page.setViewport({width:360,height:800});
    await page.evaluate(() => document.documentElement.style.fontSize='200%');
    await page.evaluate(() => dispatchEvent(new Event('resize'))); await settle();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '200% text fits');
    assert(!(await page.evaluate(() => document.documentElement.classList.contains('home-stack'))));
    await page.click('.home-menu-toggle'); await page.keyboard.press('Escape');
    const plain = await browser.newPage(); await plain.setJavaScriptEnabled(false);
    await plain.setViewport({width:360,height:800}); await plain.goto(site,{waitUntil:'networkidle0'});
    assert(await plain.$eval('.home-nav',e=>getComputedStyle(e).display!=='none'));
    assert(await plain.$$eval('.home-project',es=>es.every(e=>getComputedStyle(e).opacity==='1')));
    assert.deepEqual(errors, []);
    console.log('PASS reference-inspired scrolling, reverse highlight, focused cards, mobile menu, four widths, live reduced motion, 200% text and no script.');
  } finally { await browser.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
