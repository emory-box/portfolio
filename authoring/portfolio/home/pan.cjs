// Animate the actual egg pieces through external references to the untouched
// original SVG. Source paint order is preserved, including the pan's shadows.
const parts=[
 ['Vector'],['Vector_2'],['Vector_3','egg'],['Line / Editable stroke'],
 ['Vector_4'],['Line / Editable stroke_2'],['Vector_5','egg yolk'],
 ['Vector_6'],['Line / Editable stroke_3','egg'],
 ['Line / Editable stroke_4','egg yolk'],['Line / Editable stroke_5'],
 ['Vector_7'],['Vector_8','egg yolk']
];
module.exports=`<svg class="home-pan-scene" width="252.721" height="223" viewBox="0 0 252.721 223" fill="none" aria-hidden="true" focusable="false" hidden><g class="home-pan-tool"><ellipse class="home-pan-well" cx="108" cy="129" rx="51" ry="52" fill="#F8F8F8" opacity="0"/>${parts.map(([id,kind=''])=>`<g${kind.includes('egg')?` class="home-pan-egg${kind.includes('yolk')?' home-pan-yolk':''}"`:''}><use href="assets/img/home/pan.svg#${encodeURIComponent(id)}"/></g>`).join('')}</g></svg>`;
