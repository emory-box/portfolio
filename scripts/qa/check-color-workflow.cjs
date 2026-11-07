const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {locations,prepareDraft,recordReview,approveDraft}=require('../greeny/colors.cjs');
const ROOT=path.resolve(__dirname,'../..');

async function fixture(run){
  fs.mkdirSync(path.join(ROOT,'.cache'),{recursive:true});
  const root=fs.mkdtempSync(path.join(ROOT,'.cache/color-test-'));
  try{
    const p=locations(root);
    for(const file of [p.approved,p.model,p.poster,...p.renderer])fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(p.approved,JSON.stringify({version:1,materials:{},groups:{}}));
    fs.copyFileSync(path.join(ROOT,'projects/greeny/models/garden.glb'),p.model);
    fs.copyFileSync(path.join(ROOT,'projects/greeny/img/story/garden-fallback.png'),p.poster);
    for(const file of p.renderer)fs.writeFileSync(file,'fixture renderer');
    await run(root,p);
  }finally{
    if(path.dirname(path.resolve(root))!==path.join(ROOT,'.cache'))throw new Error('Unsafe fixture cleanup');
    fs.rmSync(root,{recursive:true,force:true});
  }
}
function reviewed(p){
  for(const file of ['review.png','poster.png'])fs.copyFileSync(p.poster,path.join(p.cache,file));
}
(async()=>{
  const THREE=await import('../../assets/vendor/three-r180/three.module.min.js');
  const {applyColors}=await import('../../projects/greeny/garden-colors.js');
  const scene=new THREE.Group(),fan=new THREE.Group(),water=new THREE.Group();
  fan.name='Fan';water.name='Sprinklers';scene.add(fan,water);
  const shared=new THREE.MeshStandardMaterial({color:'#FFFFFF'});shared.name='Device_Polymer';
  const geometry=new THREE.BoxGeometry(),fanMesh=new THREE.Mesh(geometry,shared),waterMesh=new THREE.Mesh(geometry,shared);
  fan.add(fanMesh);water.add(waterMesh);
  applyColors(scene,{version:1,groups:{Fan:'#123456'}});
  assert.equal(fanMesh.material.color.getHexString(),'123456');
  assert.equal(waterMesh.material.color.getHexString(),'ffffff');
  assert.equal(waterMesh.material,shared);
  assert.throws(()=>applyColors(scene,{version:1,groups:{Missing:'#123456'}}),/Unknown garden group/);
  geometry.dispose();shared.dispose();fanMesh.material.dispose();
  await fixture(async(root,p)=>{
    const oldProfile=fs.readFileSync(p.approved),oldModel=fs.readFileSync(p.model),oldPoster=fs.readFileSync(p.poster);
    const draft=await prepareDraft(['canopy=#2F8FC7'],4,root);
    assert.equal(draft.profile.materials.Shade_Woven,'#2F8FC7');
    assert.deepEqual(fs.readFileSync(p.approved),oldProfile);
    assert.deepEqual(fs.readFileSync(p.model),oldModel);
    assert.deepEqual(fs.readFileSync(p.poster),oldPoster);
    await assert.rejects(approveDraft(draft.id,root));
    reviewed(p);recordReview(root);
    await assert.rejects(approveDraft('wrong-id',root),/rendered draft/);
    await approveDraft(draft.id,root);
    assert.equal(JSON.parse(fs.readFileSync(p.approved)).materials.Shade_Woven,'#2F8FC7');
    assert.deepEqual(fs.readFileSync(p.model),oldModel);
    assert.equal(JSON.parse(fs.readFileSync(path.join(p.cache,'draft.json'))).status,'approved');
    await assert.rejects(approveDraft(draft.id,root),/already approved/);
  });
  await fixture(async(root,p)=>{
    await assert.rejects(prepareDraft(['missing=#123456'],0,root),/Unknown/);
    await assert.rejects(prepareDraft(['canopy=red'],0,root),/Invalid color/);
    const draft=await prepareDraft(['fan=#689B8A'],0,root);
    assert.equal(draft.profile.groups.Fan,'#689B8A');
    reviewed(p);recordReview(root);
    fs.appendFileSync(path.join(p.cache,'review.png'),'changed');
    await assert.rejects(approveDraft(draft.id,root),/Review image changed/);
  });
  await fixture(async(root,p)=>{
    let draft=await prepareDraft(['sensor=#689B8A'],0,root);reviewed(p);recordReview(root);
    fs.appendFileSync(p.renderer[0],'new renderer');
    await assert.rejects(approveDraft(draft.id,root),/renderer changed/);
    draft=await prepareDraft(['sensor=#689B8A'],0,root);reviewed(p);recordReview(root);
    fs.writeFileSync(p.approved,JSON.stringify({version:1,materials:{Shade_Woven:'#111111'},groups:{}}));
    await assert.rejects(approveDraft(draft.id,root),/colors, model or renderer changed/);
  });
  await fixture(async(root,p)=>{
    const draft=await prepareDraft(['canopy=#112233'],4,root);reviewed(p);recordReview(root);
    const file=path.join(p.cache,'draft.json'),changed=JSON.parse(fs.readFileSync(file));
    changed.profile.materials.Shade_Woven='#445566';fs.writeFileSync(file,JSON.stringify(changed));
    await assert.rejects(approveDraft(draft.id,root),/Draft changed/);
  });
  await fixture(async(root,p)=>{
    const draft=await prepareDraft(['canopy=#112233'],4,root);reviewed(p);recordReview(root);
    fs.appendFileSync(p.model,'changed model');
    await assert.rejects(approveDraft(draft.id,root),/model or renderer changed/);
  });
  console.log('PASS color workflow: preview leaves production untouched; approval requires the rendered draft; stale/tampered previews rejected; named group/material edits validated.');
})().catch(error=>{console.error(error);process.exitCode=1;});
