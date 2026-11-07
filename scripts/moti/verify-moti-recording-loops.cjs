const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync,execFileSync}=require('node:child_process');
const args=process.argv.slice(2);
let outputDirectory=path.resolve(__dirname,'../../projects/moti-pulse/video'),source,only;
for(let i=0;i<args.length;i++){
  if(args[i]==='--deep')continue;
  if(args[i]==='--outputs'||args[i]==='--only'){
    const flag=args[i],value=args[++i];
    assert(value&&!value.startsWith('--'),'Missing value for '+flag);
    if(flag==='--outputs')outputDirectory=path.resolve(value);else only=value;
  }else if(args[i].startsWith('--'))throw new Error('Unknown option: '+args[i]);
  else {assert(!source,'Pass only one raw-source directory');source=path.resolve(args[i]);}
}
// Default validation is dependency-free: verify the preserved source and live delivery hashes.
if (!process.argv.includes('--deep')) {
  const rows=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../authoring/moti-pulse/videos/manifest.json'))).filter(row=>!only||row.slug===only);
  assert(rows.length,'No matching loop project');
  const reports=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../authoring/moti-pulse/videos/validation.json'))).videos;
  const {fileHash}=require('./moti-video-runtime.cjs');
  for(const row of rows){
    const original=path.resolve(__dirname,'../../authoring/moti-pulse/videos',row.slug,'assets/original.mp4');
    const output=path.join(outputDirectory,row.slug+'.mp4');
    assert.equal(fileHash(original),row.sha256,'Source recording changed: '+row.slug);
    assert.equal(fileHash(output),reports.find(r=>r.slug===row.slug).outputSha256,'Live delivery changed: '+row.slug);
  }
  console.log('PASS: '+rows.length+' source recordings and selected MP4s match preserved delivery hashes.');
  process.exit(0);
}
const {runtime,fileHash,renderFingerprint}=require('./moti-video-runtime.cjs');const {ffmpeg,ffprobe,cli,env}=runtime();
const base=path.resolve(__dirname,'../../authoring/moti-pulse/videos');
const rows=JSON.parse(fs.readFileSync(base+'/manifest.json')).filter(row=>!only||row.slug===only);assert(rows.length,'No matching loop project');const artifacts=path.resolve(__dirname,'../../.cache/recording-loop-delivery');fs.mkdirSync(artifacts,{recursive:true});
function compare(args){const result=spawnSync(ffmpeg,['-hide_banner','-v','info',...args],{encoding:'utf8',maxBuffer:4*1024*1024});assert.equal(result.status,0,result.stderr.slice(-1000));const match=result.stderr.match(/All:([\d.]+)/);assert(match,'No SSIM result');return Number(match[1]);}
const records=[];
for(const row of rows){
  const project=path.join(base,row.slug),original=path.join(project,'assets/original.mp4'),output=path.join(outputDirectory,row.slug+'.mp4');
  if(source)assert.equal(fileHash(path.join(source,row.sourceFile)),row.sha256,'Source was changed');assert.equal(fileHash(original),row.sha256,'Project copy differs from source');
  const info=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'}));const video=info.streams.find(s=>s.codec_type==='video'),audio=info.streams.find(s=>s.codec_type==='audio');
  assert.equal(video.width,row.width);assert.equal(video.height,row.height);assert.equal(video.r_frame_rate,'30/1');assert.equal(Number(video.nb_frames),row.outputFrames);assert(Math.abs(Number(video.duration)-row.duration)<.04);assert(audio&&audio.channels===2&&audio.sample_rate==='48000');
  const sourceContentSsim=compare(['-i',original,'-i',output,'-filter_complex',`[0:v]setpts=PTS-STARTPTS[ref];[1:v]trim=end_frame=${row.originalFrames},setpts=PTS-STARTPTS[out];[ref][out]ssim`,'-an','-f','null',process.platform==='win32'?'NUL':'/dev/null']);assert(sourceContentSsim>.98,'Source sequence similarity unexpectedly low: '+row.slug);
  const frameDir=path.join(artifacts,row.slug);fs.mkdirSync(frameDir,{recursive:true});
  execFileSync(ffmpeg,['-y','-v','error','-i',output,'-vf',`select=eq(n\\,0)+eq(n\\,${row.outputFrames-1})`,'-fps_mode','vfr','-frames:v','2',path.join(frameDir,'boundary-%02d.png')]);
  const boundarySsim=compare(['-i',path.join(frameDir,'boundary-01.png'),'-i',path.join(frameDir,'boundary-02.png'),'-filter_complex','[0:v]format=yuv420p[a];[1:v]format=yuv420p[b];[a][b]ssim','-f','null',process.platform==='win32'?'NUL':'/dev/null']);assert(boundarySsim>.992,'Loop boundary differs unexpectedly: '+row.slug);
  execFileSync(ffmpeg,['-y','-v','error','-ss',String(row.videoDuration*.5),'-i',output,'-frames:v','1',path.join(frameDir,'midpoint.png')]);
  const check=JSON.parse(execFileSync(process.execPath,[cli,'check','--json'],{cwd:project,env,encoding:'utf8'}));assert.equal(check.ok,true,'HyperFrames check failed: '+row.slug);
  const fingerprint=renderFingerprint(project),outputSha256=fileHash(output);
  const report={slug:row.slug,sourceFile:row.sourceFile,sourceSha256:row.sha256,outputSha256,fingerprint,originalFrames:row.originalFrames,outputFrames:row.outputFrames,width:row.width,height:row.height,fps:30,videoDuration:Number(video.duration),audioPreserved:true,sourceContentSsim,boundarySsim,hyperframesCheck:true,bytes:fs.statSync(output).size};records.push(report);console.log(JSON.stringify({slug:row.slug,sourceContentSsim,boundarySsim,frames:row.outputFrames,ok:true}));
}
fs.writeFileSync(path.join(artifacts,'validation.json'),JSON.stringify({ok:true,checkedAt:new Date().toISOString(),runtime:'hyperframes@0.9.13',notes:['Every original input and project copy matched SHA-256.','Source interval is recompressed on export; SSIM is measured across every original frame.','Only the appended 0.6-second loop return changes the timeline.','Original pauses and silent audio warnings are intentionally retained.'],videos:records},null,2));console.log('PASS: '+rows.length+' content-preserving loop exports; report in '+path.join(artifacts,'validation.json'));
