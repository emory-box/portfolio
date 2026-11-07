// Color profiles affect materials only; geometry and animation pivots stay intact.
export function validateColors(value) {
  if (!value || value.version !== 1) throw new Error('Unsupported garden color profile');
  const result={version:1,materials:{},groups:{}};
  for(const kind of ['materials','groups']) {
    const entries=value[kind]??{};
    if(typeof entries!=='object'||Array.isArray(entries)||entries===null)throw new Error('Invalid '+kind);
    for(const [name,color] of Object.entries(entries)) {
      if(!name||['__proto__','constructor','prototype'].includes(name)||typeof color!=='string'||!/^#[\da-f]{6}$/i.test(color))throw new Error('Invalid color: '+name);
      result[kind][name]=color.toUpperCase();
    }
  }
  return result;
}

export function applyColors(garden,value) {
  const profile=validateColors(value),materials=new Set(),groups=new Set();
  garden.traverse(obj=>{
    if(!obj.isMesh)groups.add(obj.name);
    for(const m of (Array.isArray(obj.material)?obj.material:[obj.material]).filter(Boolean))materials.add(m.userData.baseMaterial??m.name);
  });
  for(const name of Object.keys(profile.materials))if(!materials.has(name))throw new Error('Unknown garden material: '+name);
  for(const name of Object.keys(profile.groups))if(!groups.has(name))throw new Error('Unknown garden group: '+name);
  garden.traverse(obj=>{
    if(!obj.isMesh)return;
    let groupColor;
    for(let node=obj.parent;node;node=node.parent)if(profile.groups[node.name]){groupColor=profile.groups[node.name];break;}
    const recolor=m=>{
      const name=m.userData.baseMaterial??m.name;
      const color=profile.materials[name]??groupColor;
      if(!color)return m;
      const copy=m.clone();copy.userData.colorOverride=color;copy.userData.baseMaterial=name;
      copy.color.set(color);return copy;
    };
    obj.material=Array.isArray(obj.material)?obj.material.map(recolor):recolor(obj.material);
  });
}
