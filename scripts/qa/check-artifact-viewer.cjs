// A normal image click must offer an in-page exit and preserve reading position.
const assert = require('node:assert/strict');
const {puppeteer, chromePath} = require('./browser-runtime.cjs').browserRuntime();
const SITE = process.env.SITE_URL || 'http://localhost:4317';

(async () => {
  const browser = await puppeteer.launch({executablePath: chromePath, headless: true,
    pipe: true, args: ['--no-sandbox', '--disable-webgl']});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({width: 1280, height: 900});
    await page.goto(SITE + '/projects/greeny/', {waitUntil: 'networkidle0'});
    await page.$eval('#interface', el => el.scrollIntoView({behavior: 'instant'}));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#interface')).opacity === '1');
    await page.$eval('#interface .deck-interface-panel a', el => el.scrollIntoView({block: 'center', behavior: 'instant'}));
    const before = await page.evaluate(() => ({url: location.href, y: scrollY}));
    const popups = [];
    page.on('popup', popup => popups.push(popup));
    await page.click('#interface .deck-interface-panel a');
    await page.waitForFunction(() => document.querySelector('dialog[open] [data-artifact-close]'), {timeout: 2000})
      .catch(() => assert.fail('Image enlargement has no in-page Close control; normal click opened a raw image in another browser context.'));
    assert.equal(popups.length, 0, 'Normal click stays in the portfolio page');
    await page.click('dialog[open] [data-artifact-close]');
    assert(!await page.$('dialog[open]'), 'Close dismisses the enlarged image');
    assert.equal(await page.url(), before.url, 'Closing returns to the same portfolio URL');
    assert(Math.abs(await page.evaluate(() => scrollY) - before.y) < 2, 'Closing preserves the reading position');
    console.log('PASS original image-click regression: visible Close and unchanged reading page.');

    async function inspect(link, exit) {
      await link.evaluate(el => {
        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          if (parent.tagName === 'DETAILS' && !parent.open) parent.querySelector(':scope > summary').click();
        }
        el.closest('[data-reveal]')?.classList.remove('is-pending');
        el.scrollIntoView({block: 'center', behavior: 'instant'});
      });
      await page.waitForFunction(() => !document.querySelector('.deck-flow')?.getAnimations().length);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await link.evaluate(el => el.addEventListener('click', () => {
        window.imageQaOpener = el;
        window.imageQaScroll = scrollY;
      }, {once: true, capture: true}));
      const url = page.url();
      await link.click();
      await page.waitForSelector('dialog[open] [data-artifact-close]');
      if (exit === 'escape') {
        await page.click('dialog[open] [data-artifact-size]');
        assert.equal(await page.$eval('dialog[open] [data-artifact-size]', el => el.getAttribute('aria-pressed')), 'true');
        await page.$eval('dialog[open] [role="region"]', el => el.scrollTo(120, 240));
      }
      assert(await page.$eval('dialog[open] [data-artifact-close]', el => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight
          && el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
      }), 'Close stays visible and clickable');
      if (exit === 'escape') await page.keyboard.press('Escape');
      else if (exit === 'backdrop') await page.mouse.click(2, 2);
      else await page.click('dialog[open] [data-artifact-close]');
      await page.waitForFunction(() => !document.querySelector('dialog[open]') && document.activeElement === window.imageQaOpener);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(page.url(), url, 'Viewer keeps the portfolio URL');
      assert(await page.evaluate(() => Math.abs(scrollY - window.imageQaScroll) < 2), 'Viewer restores the clicked reading position');
    }

    for (const [project, selector, count] of [
      ['greeny', '.greeny-case-study a[aria-haspopup="dialog"]', 13],
      ['synergy', '[data-enlarge]', 33]
    ]) {
      await page.goto(SITE + '/projects/' + project + '/', {waitUntil: 'networkidle0'});
      const links = await page.$$(selector);
      assert.equal(links.length, count, 'Every existing enlargement link is covered');
      for (const [index, link] of links.entries()) await inspect(link, ['close', 'escape', 'backdrop'][index % 3]);
      console.log('PASS ' + project + ': all ' + count + ' artwork links open with Close/Escape/backdrop and restore focus/scroll.');
      for (const [width, height, text] of [[320, 640, '200%'], [360, 900, '100%'], [844, 390, '100%']]) {
        await page.setViewport({width, height});
        await page.evaluate(size => { document.documentElement.style.fontSize = size; }, text);
        await inspect(links[0], 'close');
        console.log('PASS ' + project + ' visible Close at ' + width + '×' + height + ', text ' + text);
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      await page.setViewport({width: 1280, height: 900});
    }
    assert.equal(popups.length, 0, 'No ordinary artwork click opens an unclosable raw-image tab');
    assert.deepEqual(errors, [], 'No viewer errors');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
