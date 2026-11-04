// Normalize only the appended return using decoded video frames, avoiding a
// browser video/PNG color-profile difference at the loop boundary.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
function finishReturn(row,file,ffmpeg,{freshRender=false}={}){
  const bodyFrames=Math.round(row.originalEnd*row.fps),last=bodyFrames-1;
  const folder=path.join(path.dirname(file),'.hyperframes-original');fs.mkdirSync(folder,{recursive:true});
  const raw=path.join(folder,path.basename(file));
  if(freshRender||!fs.existsSync(raw))fs.copyFileSync(file,raw);
  const output=path.join(folder,path.basename(file,'.mp4')+'.normalized.mp4');
  const graph=`[0:v]split=3[body-in][head-in][tail-in];[body-in]trim=end_frame=${bodyFrames},setpts=PTS-STARTPTS[body];[head-in]select=eq(n\\,0),setpts=PTS-STARTPTS,loop=loop=17:size=1:start=0,setpts=N/(30*TB)[head];[tail-in]select=eq(n\\,${last}),setpts=PTS-STARTPTS,loop=loop=17:size=1:start=0,setpts=N/(30*TB)[tail];[tail][head]blend=all_expr='A*(1-min(1,T/0.5))+B*min(1,T/0.5)'[return];[body][return]concat=n=2:v=1:a=0[video]`;
  execFileSync(ffmpeg,['-y','-v','error','-i',raw,'-filter_complex',graph,'-map','[video]','-map','0:a:0','-c:v','libx264','-preset','medium','-crf','12','-pix_fmt','yuv420p','-c:a','copy','-r','30','-frames:v',String(row.outputFrames),'-movflags','+faststart',output],{stdio:['ignore','ignore','pipe']});
  fs.copyFileSync(output,file);
  return file;
}
module.exports={finishReturn};
if(require.main===module){const base=path.resolve(__dirname,'../video-projects/moti-pulse-recording-loops');const rows=JSON.parse(fs.readFileSync(base+'/manifest.json'));const {ffmpeg}=require('./moti-video-runtime.cjs').runtime();for(const row of rows.filter(r=>!process.argv[2]||r.slug===process.argv[2])){finishReturn(row,path.join(base,'renders',row.slug+'.mp4'),ffmpeg);console.log('Normalized loop return: '+row.slug);}}
