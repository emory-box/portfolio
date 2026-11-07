import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {applyColors} from './garden-colors.js';

const clamp = THREE.MathUtils.clamp;
const angles = [0, .10, .20, -.32, .12, -.12, .06, 0];
const smooth = value => { value = clamp(value, 0, 1); return value * value * (3 - 2 * value); };
const weight = (position, index) => 1 - smooth((Math.abs(position - index) - .15) / .55);
const anchors = {
  sensor: [0, .85, 0],
  nozzles: [[-1.5, 2.26, 0], [1.5, 2.26, 0]],
  fan: [-3, 1.78, 0],
  shade: [0, 3.07, -2],
  lamps: [[-1.5, 2.46, -2], [1.5, 2.46, -2]],
  hub: [4.72, .15, -1.54],
};

function reflectionRoom(renderer) {
  // Locally generated studio reflections; no HDR download or extra library.
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x657466);
  const geometry = new THREE.PlaneGeometry(8, 8);
  const material = new THREE.MeshBasicMaterial({color: new THREE.Color(2, 2, 1.8), side:THREE.DoubleSide});
  for (const p of [[-5,6,3],[5,7,-3],[0,9,0]]) {
    const panel = new THREE.Mesh(geometry,material);
    panel.position.set(...p); panel.lookAt(0,0,0); room.add(panel);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  try { return generator.fromScene(room, .12, .1, 50, {size:128}); }
  finally { generator.dispose(); geometry.dispose(); material.dispose(); }
}

function waterEffect(garden) {
  const geometry = new THREE.SphereGeometry(1, 5, 4);
  const material = new THREE.MeshBasicMaterial({color:0x8edcf0, transparent:true, opacity:.80, depthWrite:false});
  const mesh = new THREE.InstancedMesh(geometry,material,96);
  mesh.name='Story_Water';mesh.frustumCulled=false;garden.add(mesh);
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3();
  const scale = new THREE.Vector3(), rotation = new THREE.Quaternion();
  const vertical = new THREE.Vector3(0,1,0), velocity = new THREE.Vector3();
  return function update(amount,time,reduced,mobile) {
    mesh.visible=amount>.01;
    if (!mesh.visible) return;
    material.opacity=.85*amount;
    for (let i=0;i<96;i++) {
      const side=i%2, k=Math.floor(i/2), origin=anchors.nozzles[side];
      const col=k%8, row=Math.floor(k/8);
      const targetX=(side ? 0 : -3)+(col+.5)*3/8;
      const targetZ=-2+(row+.5)*4/6;
      const f=reduced ? ((i*.137)%1) : ((time*.88+i*.137)%1);
      position.set(origin[0]+(targetX-origin[0])*f,
        origin[1]-(origin[1]-.22)*f*f, origin[2]+(targetZ-origin[2])*f);
      velocity.set(targetX-origin[0],-2*(origin[1]-.22)*Math.max(f,.2),targetZ-origin[2]).normalize();
      rotation.setFromUnitVectors(vertical,velocity);
      const radius=mobile ? .022 : .012;
      scale.set(radius,radius*2.6,radius);
      matrix.compose(position,rotation,scale);mesh.setMatrixAt(i,matrix);
    }
    mesh.instanceMatrix.needsUpdate=true;
  };
}

function airflowEffect(garden) {
  const material = new THREE.LineBasicMaterial({color:0xcfe3b5,transparent:true,opacity:.4,depthWrite:false});
  const lines=[];
  for(let i=0;i<6;i++) {
    const data=new Float32Array(14*3);
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(data,3));
    const line=new THREE.Line(geometry,material);line.frustumCulled=false;garden.add(line);
    lines.push({line,data});
  }
  return function update(amount,time,reduced) {
    material.opacity=.32*amount;
    lines.forEach(({line,data},i)=>{
      line.visible=amount>.01;
      if(!line.visible)return;
      const phase=reduced ? .5 : (time*.38+i*.17)%1;
      for(let j=0;j<14;j++) {
        const f=clamp(phase-j*.024,0,1);
        data[j*3]=anchors.fan[0]+.20+f*5.6;
        data[j*3+1]=anchors.fan[1]-f*.75+Math.sin(f*Math.PI*3+i)*.035;
        data[j*3+2]=anchors.fan[2]*(1-f)+(i-2.5)*.14*f;
      }
      line.geometry.attributes.position.needsUpdate=true;
    });
  };
}

function networkEffect(garden) {
  const group=new THREE.Group();group.name='Story_Connections';garden.add(group);
  const material=new THREE.LineDashedMaterial({color:0xafd182,dashSize:.10,gapSize:.10,transparent:true,opacity:.7});
  const packetMaterial=new THREE.MeshBasicMaterial({color:0xcfe3b5,transparent:true,opacity:.9,depthWrite:false});
  const packetGeometry=new THREE.SphereGeometry(.045,8,6);
  const packets=[];
  const hub=new THREE.Vector3(...anchors.hub);
  for(const p of [anchors.sensor,...anchors.nozzles,anchors.fan,anchors.shade,...anchors.lamps]) {
    const start=new THREE.Vector3(...p);
    const bend=new THREE.Vector3(3.35,start.y,start.z);
    const points=[start,bend,new THREE.Vector3(3.35,start.y,hub.z),hub];
    const route=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);
    route.computeLineDistances();group.add(route);
    const packet=new THREE.Mesh(packetGeometry,packetMaterial);group.add(packet);
    const path=new THREE.CurvePath();
    for(let i=1;i<points.length;i++)path.add(new THREE.LineCurve3(points[i-1],points[i]));
    packets.push({packet,path});
  }
  return function update(position,time,reduced) {
    group.visible=position>5.45;
    const amount=smooth((position-5.45)/.5);
    material.opacity=amount*.70;packetMaterial.opacity=amount*.9;
    if(group.visible)packets.forEach(({packet,path},i)=>{
      packet.visible=!reduced;
      if(!reduced)path.getPoint((time*.24+i/packets.length)%1,packet.position);
    });
  };
}

export async function createGardenScene(canvas,{colorProfile}={}) {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=innerWidth>=1000;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-6.8,6.8,6.8,-6.8,.1,100);
  camera.position.set(9,8,11);camera.lookAt(.6,.95,0);
  const hemi=new THREE.HemisphereLight(0xf8fbf4,0x263629,1.05);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xf8fbf4,1.8);
  key.position.set(-3,8,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:30});
  key.shadow.bias=-.0003;key.shadow.normalBias=.012;scene.add(key);
  const fill=new THREE.DirectionalLight(0xcfe3b5,.65);
  fill.position.set(6,5,-5);scene.add(fill);
  let garden;
  try {
    const [asset,profile]=await Promise.all([
      new GLTFLoader().loadAsync(new URL('models/garden.glb',import.meta.url).href),
      colorProfile??fetch(new URL('models/colors.json',import.meta.url),{cache:'no-store'}).then(response=>{
        if(!response.ok)throw new Error('Unable to load approved garden colors');
        return response.json();
      }),
    ]);
    garden=asset.scene;applyColors(garden,profile);
  }
  catch(error) { renderer.dispose();throw error; }
  const required=['Garden_Root','Sensor','Fan_Rotor','Shade_Deploy','Sprinklers','Lights','Hub'];
  if(required.some(name=>!garden.getObjectByName(name))) {
    garden.traverse(obj=>{obj.geometry?.dispose();if(obj.material)for(const value of Object.values(obj.material))if(value?.isTexture)value.dispose();obj.material?.dispose();});
    renderer.dispose();throw new Error('Garden asset is missing a required device group');
  }
  scene.add(garden);
  let environment;
  try { environment=reflectionRoom(renderer);scene.environment=environment.texture; }
  catch { /* The same PBR materials remain readable under the direct lights. */ }
  const fan=garden.getObjectByName('Fan_Rotor');
  const shade=garden.getObjectByName('Shade_Deploy');
  const hub=garden.getObjectByName('Hub');
  // Cache each object's local center so its annotation follows transforms,
  // including the shade's continuously changing deployment length.
  const localCenter=object=>object.worldToLocal(new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3()));
  const shadeCenter=localCenter(shade),hubCenter=localCenter(hub);
  const lampMaterials=new Set(),indicatorMaterials=new Set(),hubMaterials=new Set();
  garden.traverse(obj=>{
    if(!obj.isMesh)return;
    obj.castShadow=true;obj.receiveShadow=true;
    const m=obj.material;
    const materialName=m.userData.baseMaterial??m.name;
    if(m.map)m.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    if(materialName==='Shade_Woven') {
      m.alphaTest=.45;m.transparent=false;m.side=THREE.DoubleSide;
      obj.castShadow=true;
    }
    if(materialName==='Lamp_Diffuser') {
      // The exporter folds the initial low emission into the color factor.
      // Restore its physical light color before driving intensity at runtime.
      m.emissive.set(m.userData.colorOverride??0xffedba);lampMaterials.add(m);
    }
    if(obj.parent.name==='Sensor' && materialName==='Indicator') {
      obj.material=m.clone();obj.material.emissive.set(m.userData.colorOverride??0xafd182);indicatorMaterials.add(obj.material);
    }
    if(materialName==='Hub_Indicator')hubMaterials.add(m);
  });
  const lamps=anchors.lamps.map(p=>{
    const light=new THREE.SpotLight([...lampMaterials][0]?.userData.colorOverride??0xffedba,0,5.2,.8,.65,1.5);
    light.position.set(...p);light.target.position.set(p[0],.20,-.35);
    garden.add(light,light.target);return light;
  });
  const water=waterEffect(garden),airflow=airflowEffect(garden),network=networkEffect(garden);
  let width=0,height=0,fanAngle=0,disposed=false;
  const presentation={lightAmount:0,hubReceiving:false};

  function draw({position,index,time,delta,reduced,paused,sensorReading=false}) {
    if(disposed)return false;
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w||!h)return false;
    if(width!==w||height!==h) {
      width=w;height=h;renderer.setSize(w,h,false);
      renderer.shadowMap.enabled=innerWidth>=1000;
      const halfWidth=Math.max(6.55,4.9*w/h);
      camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfWidth*h/w;camera.bottom=-camera.top;
      camera.updateProjectionMatrix();
    }
    const first=Math.floor(position),next=Math.min(first+1,angles.length-1);
    const blend=smooth((position-first-.18)/.64);
    garden.rotation.y=reduced ? 0 : THREE.MathUtils.lerp(angles[first],angles[next],blend);
    const effectsPosition=reduced ? index : position;
    const watering=weight(effectsPosition,2),ventilation=weight(effectsPosition,3);
    const shading=weight(effectsPosition,4),lighting=weight(effectsPosition,5),sensing=weight(effectsPosition,1);
    if(!reduced&&!paused)fanAngle+=delta*11*ventilation;
    fan.rotation.x=reduced ? 0 : fanAngle;
    // A slow demonstration cycle keeps the shade moving at a stationary scroll
    // stop, with zero velocity at both ends. Reduced motion keeps it deployed.
    const shadeCycle=reduced ? 1 : .5+.5*Math.cos(time*Math.PI/4);
    shade.scale.z=.10+.90*shading*(.18+.82*shadeCycle);
    lampMaterials.forEach(m=>{m.emissiveIntensity=.05+lighting*2.8;});
    indicatorMaterials.forEach(m=>{m.emissiveIntensity=.3+sensing*(sensorReading ? .65+.25*Math.sin(time*3) : .5);});
    presentation.hubReceiving=sensorReading||weight(effectsPosition,6)>.55;
    // Soft breathing in the beam overlay, without flashing the garden lights.
    presentation.lightAmount=lighting*(reduced ? 1 : .98+.02*Math.cos(time*1.4));
    hubMaterials.forEach(m=>{
      const hue=presentation.hubReceiving?0xf4ca8c:(m.userData.colorOverride??0xb9eba9);
      m.color.set(hue);m.emissive.set(hue);
      m.emissiveIntensity=presentation.hubReceiving&&!reduced?1.25+.55*Math.sin(time*3):1.8;
    });
    lamps.forEach(light=>light.intensity=lighting*10);
    hemi.intensity=1.05-lighting*.60;key.intensity=1.8-lighting*1.15;
    scene.environmentIntensity=.55-lighting*.25;
    water(watering,time,reduced,innerWidth<1000);
    airflow(ventilation,time,reduced);network(effectsPosition,time,reduced);
    renderer.render(scene,camera);
    return !reduced&&!paused&&(watering>.01||ventilation>.01||shading>.01||lighting>.01||sensorReading||effectsPosition>5.45);
  }

  const projectedPoint=new THREE.Vector3();
  function projectPoint(point) {
    projectedPoint.set(...point).applyMatrix4(garden.matrixWorld).project(camera);
    return [(projectedPoint.x+1)*width/2,(1-projectedPoint.y)*height/2];
  }
  function projectObjectPoint(object,point) {
    projectedPoint.copy(point).applyMatrix4(object.matrixWorld).project(camera);
    return [(projectedPoint.x+1)*width/2,(1-projectedPoint.y)*height/2];
  }

  function project() {
    const [nozzleX,nozzleY,nozzleZ]=anchors.nozzles[0];
    const lights=presentation.lightAmount>.001?anchors.lamps.map(p=>{
      const x=p[0];
      const top=[projectPoint([x-.30,p[1],p[2]]),projectPoint([x+.30,p[1],p[2]])];
      const bottom=[projectPoint([x+.78,.24,-.35]),projectPoint([x-.78,.24,-.35])];
      const pool=Array.from({length:40},(_,i)=>projectPoint([x+.78*Math.cos(i*Math.PI*2/40),.235,-.35+.55*Math.sin(i*Math.PI*2/40)]));
      return {top,cone:[...top,...bottom],pool};
    }):[];
    const [lampX,lampY,lampZ]=anchors.lamps[0];
    return {width,height,sensor:projectPoint([0,1.13,.10]),sprinkle:projectPoint([nozzleX,nozzleY+.08,nozzleZ]),
      fan:projectPoint(anchors.fan),shade:projectObjectPoint(shade,shadeCenter),lamp:projectPoint([lampX,lampY+.10,lampZ]),hub:projectObjectPoint(hub,hubCenter),lights,...presentation};
  }

  function dispose() {
    if(disposed)return;disposed=true;
    const geometries=new Set(),materials=new Set(),textures=new Set(),images=new Set();
    scene.traverse(obj=>{
      if(obj.geometry)geometries.add(obj.geometry);
      for(const m of (Array.isArray(obj.material)?obj.material:[obj.material]).filter(Boolean)) {
        materials.add(m);
        for(const value of Object.values(m))if(value?.isTexture)textures.add(value);
      }
    });
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    textures.forEach(t=>{if(t.image?.close)images.add(t.image);t.dispose();});
    images.forEach(img=>img.close());environment?.dispose();renderer.dispose();
  }
  return {draw,project,dispose};
}
