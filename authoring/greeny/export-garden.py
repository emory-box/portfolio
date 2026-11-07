"""Export the current approved garden from source/garden-base.blend.

Run: blender --background --factory-startup --python-exit-code 1
--python authoring/greeny/export-garden.py
Outputs: garden.blend, renders/, and projects/greeny/models/garden.{glb,json}.
"""
import hashlib
import json
import math
from pathlib import Path
import sys
import time

import bmesh
import bpy

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PROJECT = ROOT/'projects/greeny'
sys.path.insert(0, str(HERE))
import garden_geometry as g

BASE_PALETTE = {"Ground_Moss":"8EBE50","Soil_Edge":"B69C8B","Soil_Granular":"BDA491","Leaf_Green":"8EBE50","Leaf_Young":"AFD182","Stem":"6C9537","Grass_Clay":"8EBE50","Fence_Clay":"AD9380","Frame_Anodized":"C8D1BC","Device_Polymer":"F8FBF4","Sensor_Satin":"6C9537","Indicator":"AFD182","Fan_Blade":"8EBE50","Lamp_Diffuser":"FFF1CC","Shade_Woven":"1B6799","Hub_Cream":"F8FBF4","Hub_Sage":"8EBE50","Hub_Recess":"6C9537","Hub_Indicator":"AFD182","Petal_Cream":"F8FBF4","Flower_Center":"EAD49C"}

PALETTE = {'Shade_Woven':'1B6799', 'Leaf_Green':'8EBE50', 'Leaf_Young':'AFD182', 'Stem':'6C9537'}
FAN_POSITION = (-3,1.78,0)
EXTRA_TUFTS = [(3.75,-.55),(3.85,.85)]


def build_blades(rotor):
    """The approved swept clay paddle, repeated identically every 120 degrees."""
    for blade in range(3):
        points=[]; faces=[]; rows=24; cols=16
        phase=blade*math.tau/3
        points.append((0,.065*math.cos(phase),.065*math.sin(phase)))
        for row in range(1,rows):
            u=row/rows; radius=.065+.315*u; angle=phase+.32*u
            width=.125*math.sin(math.pi*u)**.70*(.55+.45*u)
            thickness=.033*math.sin(math.pi*u)**.6
            for col in range(cols):
                phi=col*math.tau/cols; tangent=width*math.cos(phi)
                points.append((.014*math.sin(math.pi*u)+thickness*math.sin(phi),
                    radius*math.cos(angle)-tangent*math.sin(angle),
                    radius*math.sin(angle)+tangent*math.cos(angle)))
        tip=len(points)
        points.append((0,.38*math.cos(phase+.32),.38*math.sin(phase+.32)))
        for col in range(cols):faces.append((0,1+col,1+(col+1)%cols))
        for row in range(rows-2):
            for col in range(cols):
                a=1+row*cols+col; b=1+row*cols+(col+1)%cols
                faces.append((a,b,b+cols,a+cols))
        for col in range(cols):
            faces.append((tip,1+(rows-2)*cols+(col+1)%cols,1+(rows-2)*cols+col))
        obj=g.mesh(f'Fan_Swept_Blade_{blade+1}',points,faces,'Fan_Blade',rotor,smooth=True)
        bm=bmesh.new(); bm.from_mesh(obj.data)
        bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
        bm.to_mesh(obj.data); bm.free()
        obj.modifiers.new('Rounded clay blade','SUBSURF').levels=1


def apply_refinements():
    for material in bpy.data.materials:g.MATS[material.name]=material
    for name,color in PALETTE.items():
        material=bpy.data.materials[name]
        rgb=[g.linear(int(color[i:i+2],16)/255) for i in (0,2,4)]
        material.diffuse_color=(*rgb,1)
        material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*rgb,1)
    rotor=bpy.data.objects['Fan_Rotor']
    for obj in list(rotor.children):
        if obj.type!='MESH':continue
        if obj.data.materials[0].name=='Fan_Blade':bpy.data.objects.remove(obj,do_unlink=True)
        else:obj.modifiers.new('Smooth center cap','SUBSURF').levels=2
    build_blades(rotor)
    bpy.data.objects['Fan'].location=g.xyz(FAN_POSITION)
    irrigation=bpy.data.objects['Sprinklers']
    for side in [-1,1]:
        frame_x=side*3; head_x=side*1.5; direction=-side
        radius=.085; bend_y=2.345+radius
        points=[(frame_x,3.05,0)]
        for i in range(9):
            angle=math.pi+i*math.pi/16
            points.append((frame_x+direction*radius*(1+math.cos(angle)),
                bend_y+radius*math.sin(angle),0))
        points.append((head_x-direction*.32,2.345,0))
        arm=g.curve(f'Irrigation_Arm_{side}',points,.04,'Frame_Anodized',irrigation)
        arm.data.bevel_resolution=4
        g.round_rod(f'Irrigation_Coupler_{side}',
            (head_x-direction*.35,2.345,0),(head_x-direction*.20,2.345,0),
            .027,'Device_Polymer',irrigation)
    for i,(x,z) in enumerate(EXTRA_TUFTS):
        group=g.group(f'Added_Grass_Tuft_{i+1}',bpy.data.objects['Grass_and_Flowers'])
        for j in range(3):
            tuft=g.pebble(f'Added_Grass_{i}_{j}',(x+(j-1)*.09,-.08,z),
                (.065,.14 if j==1 else .10,.05),'Grass_Clay',group)
            tuft.rotation_euler.y=(j-1)*.52


def main():
    started=time.perf_counter()
    base=HERE/'source/garden-base.blend'
    bpy.ops.wm.open_mainfile(filepath=str(base))
    bpy.context.preferences.filepaths.save_version=0
    scene=bpy.context.scene; scene.frame_set(1)
    apply_refinements()
    root=bpy.data.objects['Garden_Root']
    root['style']='Owner-approved smooth clay: blue canopy, deeper seedlings and centered fan'
    root['reference']='Owner-approved model; docs/greeny/garden-model.md'
    g.optimize(root)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [root]+root.children_recursive:obj.select_set(True)
    bpy.context.view_layer.objects.active=root
    bpy.ops.export_scene.gltf(filepath=str(PROJECT/'models/garden.glb'),export_format='GLB',
        use_selection=True,export_apply=True,export_animations=True,
        export_animation_mode='SCENE',export_anim_scene_split_object=False,
        export_frame_range=True,export_extras=True)
    scene.render.resolution_x=1600; scene.render.resolution_y=1248
    scene.render.resolution_percentage=100; scene.cycles.samples=64
    scene.cycles.use_denoising=True
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='CUDA'; prefs.get_devices()
    for device in prefs.devices:device.use=device.type=='CUDA'
    scene.cycles.device='GPU' if any(d.use for d in prefs.devices) else 'CPU'
    for name,frame in [('garden',1),('garden-shade',193)]:
        scene.frame_set(frame); scene.render.filepath=str(HERE/'renders'/(name+'.png'))
        bpy.ops.render.render(write_still=True)
    scene.frame_set(1); scene.render.filepath='//renders/garden.png'
    bpy.ops.object.select_all(action='DESELECT'); root.select_set(True)
    bpy.context.view_layer.objects.active=root
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE/'garden.blend'),compress=True)
    meshes=[obj for obj in root.children_recursive if obj.type=='MESH']
    for obj in meshes:obj.data.calc_loop_triangles()
    manifest={'style':root['style'],'blender':bpy.app.version_string,
        'palette':{**BASE_PALETTE,**PALETTE},'fan_position_web':FAN_POSITION,
        'extra_tuft_positions_web_xz':EXTRA_TUFTS,'mesh_objects':len(meshes),
        'triangles':sum(len(obj.data.loop_triangles) for obj in meshes),
        'counts':{'seedlings':12,'fan':1,'fan_blades':3,'nozzles':2,'lights':2,'hub':1,'added_grass_tufts':2},
        'source_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'base_blend_sha256':hashlib.sha256(base.read_bytes()).hexdigest(),
                'geometry_sha256':hashlib.sha256((HERE/'garden_geometry.py').read_bytes()).hexdigest(),
        'approval':'docs/greeny/garden-model.md','seconds':round(time.perf_counter()-started,2)}
    (PROJECT/'models/garden.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
    print('REFINED_GARDEN_COMPLETE',json.dumps(manifest))


if __name__=='__main__':main()
