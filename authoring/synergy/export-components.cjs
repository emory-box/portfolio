// One continuous component sheet, preserving the three original source boards.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const boards=[['components-input-navigation.png',0,1080],['components-calendar-facility.png',1104,1157],['components-content.png',2261,1080]];
const images=boards.map(([file,y,height])=>{
  const data=fs.readFileSync(path.join(root,'projects/synergy/img',file));
  if(data.readUInt32BE(16)!==1920 || data.readUInt32BE(20)!==height) throw new Error('Review component dimensions before exporting '+file);
  return `<image x="0" y="${y}" width="1920" height="${height}" href="data:image/png;base64,${data.toString('base64')}"/>`;
});
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 3270" role="img" aria-labelledby="component-title component-description"><title id="component-title">Components</title><desc id="component-description">All original component layouts from slides 37–39 on one sheet: navigation bar, text fields, date pickers, page headers, marketing banner, fee and room cards, segments, category, tag, news, meetings, calendar, location and campus cards.</desc><rect width="1920" height="3270" fill="#1c1f22"/>${images.join('')}</svg>`;
fs.writeFileSync(path.join(root,'projects/synergy/img/components.svg'),svg);
console.log('Exported one component atlas from source slides 37–39.');
