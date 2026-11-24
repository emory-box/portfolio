// Keep all original board geometry; use the original inactive Moti logo paint.
const fs=require('node:fs'),path=require('node:path');
module.exports=function exportNeutralBoard(){
  const folder=path.resolve(__dirname,'../../../assets/img/home');
  const source=fs.readFileSync(path.join(folder,'board-moti.svg'),'utf8');
  if((source.match(/stroke="#1F1F1F"/g)||[]).length!==3)throw new Error('Review original Moti board logo paint before deriving the neutral state');
  const neutral=source.replaceAll('stroke="#1F1F1F"','stroke="black" stroke-opacity="0.2"');
  fs.writeFileSync(path.join(folder,'board-neutral.svg'),neutral);
};
if(require.main===module)module.exports();
