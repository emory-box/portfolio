// Stable visual grouping without moving sections or changing their anchors.
const chapters={
  brief:['introduction',true],
  branding:['logo',true],'brand-safezone':['logo',false],
  research:['research',true],personas:['research',false],
  experience:['experience',true],sitemap:['experience',false],'user-flows':['experience',false],
  ui:['ui-system',true],typography:['ui-system',false],icons:['ui-system',false],components:['ui-system',false],
  interface:['user-interface',true],
};
module.exports=html=>html.replace(/<section\b[^>]*>/g,tag=>{
  const id=tag.match(/\sid="([^"]+)"/)?.[1],chapter=chapters[id];
  if(!chapter)return tag;
  const clean=tag.replace(/\sdata-case-chapter="[^"]*"|\sdata-case-start(?:="[^"]*")?/g,'');
  return clean.slice(0,-1)+` data-case-chapter="${chapter[0]}"${chapter[1]?' data-case-start':''}>`;
});
