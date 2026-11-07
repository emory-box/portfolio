// Preserve the two original capture slices in one complete SVG composition.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const sources=['spacing-1.png','spacing-2.png'];
const images=sources.map((file,index)=>{
  const data=fs.readFileSync(path.join(root,'projects/synergy/img',file));
  if(data.readUInt32BE(16)!==1920 || data.readUInt32BE(20)!==1080) throw new Error('Review spacing capture dimensions before exporting '+file);
  return `<image x="0" y="${index*1080}" width="1920" height="1080" href="data:image/png;base64,${data.toString('base64')}"/>`;
});
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="320 390 1300 1580" role="img" aria-labelledby="spacing-title spacing-description"><title id="spacing-title">Spacing</title><desc id="spacing-description">Original spacing measurements around All Meetings on the left and Home lower on the right. The continuous source diagram includes 8, 12, 16, 20 and 24 pixel annotations.</desc>${images.join('')}</svg>`;
fs.writeFileSync(path.join(root,'projects/synergy/img/spacing.svg'),svg);
console.log('Exported one continuous spacing diagram from source slides 33–34.');
