const {esc} = require('./render-diagram.cjs');
const {assets} = require('./references/components.json');

function image(name, description) {
  const asset = assets.find(item => item.name === name);
  if (!asset) throw new Error('Missing original component: ' + name);
  return `<img src="img/components/${asset.name}.svg" width="${asset.width}" height="${asset.height}" alt="${esc(description)}" loading="lazy" data-component-asset="${asset.name}" data-source-figma="${asset.node}">`;
}
function figure(name, description) {
  return `<figure class="deck-component-image" data-component="${name}"><a href="img/components/${name}.svg" target="_blank" rel="noopener" aria-label="Enlarge ${esc(description)}">${image(name, description)}</a></figure>`;
}
module.exports = {image, figure};
