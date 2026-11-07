import hashlib
import json
from pathlib import Path
import bpy
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

p=Path('projects/greeny').resolve()
m=json.loads((p/'models/garden.json').read_text())
for key,file in [('source_sha256','authoring/greeny/export-garden.py'),('base_blend_sha256','authoring/greeny/source/garden-base.blend'),('geometry_sha256','authoring/greeny/garden_geometry.py')]:
    assert m[key]==hashlib.sha256((Path(file)).read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(Path('authoring/greeny/garden.blend')))
root=bpy.data.objects['Garden_Root'];scene=bpy.context.scene
assert len([o for o in root.children_recursive if o.name.startswith('Seedling_') and o.type=='EMPTY'])==12
assert len([o for o in root.children_recursive if o.name.startswith('Added_Grass_Tuft_') and o.type=='EMPTY'])==2
linear=lambda c:c/12.92 if c<.04045 else ((c+.055)/1.055)**2.4
for name,color in [('Shade_Woven','1B6799'),('Leaf_Green','8EBE50'),('Leaf_Young','AFD182'),('Stem','6C9537'),('Sensor_Satin','6C9537')]:
    actual=bpy.data.materials[name].diffuse_color[:3]
    assert all(abs(a-linear(int(color[i:i+2],16)/255))<1e-5 for a,i in zip(actual,[0,2,4]))
assert (bpy.data.objects['Fan'].location-Vector((-3,0,1.78))).length<1e-5
for o in root.children_recursive:
    if o.type!='MESH':continue
    shader=o.data.materials[0].node_tree.nodes.get('Principled BSDF')
    assert shader.inputs['Roughness'].default_value>=.85
    assert shader.inputs['Metallic'].default_value==0
    assert not any(n.type=='TEX_IMAGE' for n in o.data.materials[0].node_tree.nodes)
# Actual exported blades must be three separate, radially aligned paddles.
o=next(o for o in bpy.data.objects['Fan_Rotor'].children if o.type=='MESH' and o.data.materials[0].name=='Fan_Blade')
neighbors={v.index:set() for v in o.data.vertices}
for edge in o.data.edges:
    a,b=edge.vertices;neighbors[a].add(b);neighbors[b].add(a)
remaining=set(neighbors);islands=[]
while remaining:
    stack=[remaining.pop()];indices=[]
    while stack:
        i=stack.pop();indices.append(i)
        for j in neighbors[i]&remaining:remaining.remove(j);stack.append(j)
    islands.append(indices)
assert len(islands)==3
for indices in islands:
    points=np.array([(o.matrix_local@o.data.vertices[i].co)[:] for i in indices])[:,1:]
    center=points.mean(axis=0);values,vectors=np.linalg.eigh(np.cov(points.T))
    assert abs(np.dot(vectors[:,np.argmax(values)],center/np.linalg.norm(center)))>.85
    assert max(np.linalg.norm(points,axis=1))<.388
for frame,extension in [(1,.1),(193,1),(337,.1)]:
    scene.frame_set(frame)
    assert abs(bpy.data.objects['Shade_Deploy'].scale.y-extension)<1e-4
    points=[world_to_camera_view(scene,scene.camera,o.matrix_world@Vector(c)) for o in root.children_recursive if o.type=='MESH' for c in o.bound_box]
    assert min(v.x for v in points)>.025 and max(v.x for v in points)<.975
    assert min(v.y for v in points)>.025 and max(v.y for v in points)<.975
print('PASS native refined model: provenance, exact palette, 12 plants, 2 added tufts, centered fan, 3 aligned blades with clearance, matte materials, pivots and framing.')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(p/'models/garden.glb'))
for name in ['Garden_Root','Sensor','Fan_Rotor','Shade_Deploy','Sprinklers','Lights','Hub','Added_Grass_Tuft_1','Added_Grass_Tuft_2']:
    assert bpy.data.objects.get(name),name
print('PASS exported GLB re-import with device pivots and both additional grass groups.')
