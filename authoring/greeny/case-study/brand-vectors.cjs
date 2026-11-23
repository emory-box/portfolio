// Figma 2995:20111: preserve the supplied SVG layers; compose only their frames/text.
const fs = require('node:fs');
const path = require('node:path');

module.exports = function brandVectors(web) {
  const folder = path.join(web, 'img/brand/current');
  const uri = file => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(folder, file + '.svg')).toString('base64');
  const font = name => fs.readFileSync(path.join(web, '../../assets/fonts', name + '-latin.woff2')).toString('base64');
  const styles = `<style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font('inter')});font-weight:100 900}@font-face{font-family:Nunito;src:url(data:font/woff2;base64,${font('nunito')});font-weight:200 1000}text{font-family:Inter,sans-serif;font-size:13px;fill:#a8b0a6}.wordmark{font-family:Nunito,sans-serif;font-size:24px;font-weight:800;fill:#6c9537}</style>`;
  const layer = file => `<image width="240" height="300" href="${uri(file)}"/>`;
  const mark = (x, y, small = false) => {
    const id = `mask-${x}-${y}`, w = small ? 34.4607 : 119.863, h = small ? 40 : 139.13;
    return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}" style="mask-type:alpha"><image x="${x}" y="${y}" width="${w}" height="${h}" href="${uri(small ? '1435b' : 'fe04e')}"/></mask></defs><image x="${x}" y="${y}" width="${small ? 34.4628 : 119.871}" height="${small ? 40.0117 : 139.159}" mask="url(#${id})" href="${uri(small ? '660c0' : '0b763')}"/>`;
  };
  const grid = `<rect x="20.5" y="30.5" width="199" height="259" fill="none" stroke="#3a3a3a"/>${mark(60,70)}<text class="wordmark" x="120" y="249" text-anchor="middle">GREENY</text><text x="110" y="15">6a</text><text x="228" y="147">7a</text><text x="24" y="285">1a</text>${layer('ab769')}${layer('12cc1')}`;
  const safezone = `<rect x="20.5" y="20.5" width="199" height="259" fill="none" stroke="#3a3a3a"/>${mark(60,60)}<text class="wordmark" x="120" y="241" text-anchor="middle">GREENY</text>${mark(23,20,true)}${mark(183,240,true)}${layer('5a198')}${mark(183,20,true)}${mark(23,240,true)}`;
  for (const [id, title, content] of [['logo-grid-vector', 'Greeny logo construction grid', grid], ['logo-safezone-vector', 'Greeny logo clear space', safezone]]) {
    fs.writeFileSync(path.join(web, 'img/brand', id + '.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300" role="img" aria-labelledby="title"><title id="title">${title}</title>${styles}${content}</svg>\n`);
  }
};
