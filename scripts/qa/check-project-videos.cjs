const assert = require('node:assert/strict');
const {puppeteer, chromePath} = require('./browser-runtime.cjs').browserRuntime();
const SITE = process.env.SITE_URL || 'http://localhost:4317';
const videos = {greeny: 'NN9Esg6nsKk', synergy: 'qS-jUoC5j08'};

(async () => {
  const browser = await puppeteer.launch({executablePath: chromePath, headless: true,
    pipe: true, args: ['--no-sandbox', '--disable-webgl']});
  try {
    for (const [slug, id] of Object.entries(videos)) {
      for (const width of [360, 768, 1280, 1920]) {
        const page = await browser.newPage(), errors = [], external = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setRequestInterception(true);
        page.on('request', request => {
          if (request.url().startsWith(SITE + '/') || !/^https?:/.test(request.url())) return request.continue();
          external.push(request.url());
          // Verify player activation without relying on YouTube's live network.
          if (request.url().startsWith('https://www.youtube-nocookie.com/embed/')) {
            return request.respond({status: 200, contentType: 'text/html', body: '<!doctype html><title>Embed test</title>'});
          }
          return request.abort();
        });
        await page.setViewport({width, height: 900});
        await page.emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}]);
        await page.goto(SITE + '/projects/' + slug + '/', {waitUntil: 'networkidle0'});
        assert.equal(await page.$$eval('#project-video', els => els.length), 1);
        assert.equal(await page.$$eval('#project-video iframe', els => els.length), 0, 'No automatic player load');
        assert.deepEqual(external, [], 'No remote requests before Play');
        assert.equal(await page.$$eval('.project-video-link', els => els.length), 0, 'No standalone Watch on YouTube link');
        assert.equal(await page.$$eval('.project-contents a[href="#project-video"]', els => els.length), 1);
        assert.deepEqual(await page.$eval('.project-contents a[href="#interface"]', el =>
          [...el.closest('.project-contents-group').querySelectorAll('.project-contents-heading a')].map(a => a.hash)),
          ['#interface', '#project-video'], 'Video follows User Interface in the same Contents column');
        assert(await page.$eval('#project-video', el => !el.closest('main[data-stack],.garden-story,.greeny-case-study')), 'Video stays outside protected stories');
        await page.$eval('#project-video', el => el.scrollIntoView({block: 'start', behavior: 'instant'}));
        const before = await page.$eval('.project-video-frame', el => el.getBoundingClientRect().toJSON());
        assert(before.width >= 200 && before.height >= 200, 'Usable player viewport');
        assert(await page.$eval('#project-video', el => el.getBoundingClientRect().bottom <= document.querySelector('.portfolio-return-top').getBoundingClientRect().top), 'Video precedes Back to top');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
        const loaded = page.waitForResponse(response => response.url().startsWith('https://www.youtube-nocookie.com/embed/'));
        await page.focus('.project-video-play');
        await page.keyboard.press('Enter');
        await loaded;
        const player = await page.$eval('#project-video iframe', el => ({src: el.src, title: el.title,
          allow: el.allow, full: el.allowFullscreen, policy: el.referrerPolicy, rect: el.getBoundingClientRect().toJSON()}));
        const url = new URL(player.src);
        assert.equal(url.pathname, '/embed/' + id);
        assert.equal(url.searchParams.get('playsinline'), '1');
        assert.equal(url.searchParams.get('autoplay'), '1', 'Playback requested only by explicit Play');
        assert(player.title.includes(slug === 'greeny' ? 'Greeny' : 'Synergy'));
        assert(player.full && player.allow.includes('autoplay'));
        assert.equal(player.policy, 'strict-origin-when-cross-origin');
        assert(Math.abs(player.rect.width - before.width) < 1 && Math.abs(player.rect.height - before.height) < 1, 'Activation preserves frame size');
        assert.equal(await page.$$eval('.project-video-play', els => els.length), 0);
        assert.deepEqual(errors, []);
        await page.close();
      }
      const plain = await browser.newPage();
      await plain.setJavaScriptEnabled(false);
      await plain.goto(SITE + '/projects/' + slug + '/', {waitUntil: 'networkidle0'});
      assert(await plain.$eval('.project-video-play', el => el.hidden));
      assert(await plain.$eval('.project-video-frame a', (el, expected) => el.getAttribute('href').endsWith(expected), id));
      assert.equal(await plain.$$eval('#project-video iframe', els => els.length), 0);
      await plain.close();
      console.log('PASS ' + slug + ': inline activation, correct video, stable responsive frame, keyboard, no pre-play requests and no-JS fallback.');
    }
    const other = await browser.newPage();
    for (const path of ['/', '/projects/moti-pulse/']) {
      await other.goto(SITE + path);
      assert.equal(await other.$$eval('[data-project-video]', els => els.length), 0);
    }
    console.log('PASS video feature remains scoped to Greeny and Synergy. Player network stubbed; live playback not covered by this check.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
