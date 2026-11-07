"""Geometry helpers for the current Greeny garden exporter only."""
import bpy
from mathutils import Vector

MATS = {}
GROUPS = {}


def xyz(p):
    return Vector((p[0], -p[2], p[1]))


def linear(c):
    return c / 12.92 if c < .04045 else ((c + .055) / 1.055) ** 2.4


def group(name,parent=None,position=(0,0,0)):
    obj=bpy.data.objects.new(name,None)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent=parent
    obj.location=xyz(position)
    GROUPS[name]=obj
    return obj


def finish(obj,name,material,parent,bevel=0):
    obj.name=name
    obj.parent=parent
    obj.data.materials.append(MATS[material])
    if bevel:
        mod=obj.modifiers.new('Manufactured edge radius','BEVEL')
        mod.width=bevel;mod.segments=3
        normals=obj.modifiers.new('Corner normals','WEIGHTED_NORMAL')
        normals.keep_sharp=True
    return obj


def rod(name,start,end,r,material,parent,vertices=16):
    a,b=xyz(start),xyz(end)
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=(b-a).length,location=(a+b)/2)
    obj=bpy.context.object
    obj.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler()
    for polygon in obj.data.polygons:polygon.use_smooth=True
    return finish(obj,name,material,parent,.004 if r>.02 else 0)


def mesh(name,points,faces,material,parent,uv=None,smooth=False):
    data=bpy.data.meshes.new(name)
    data.from_pydata([xyz(p) for p in points],[],faces)
    data.update()
    obj=bpy.data.objects.new(name,data)
    bpy.context.scene.collection.objects.link(obj)
    finish(obj,name,material,parent)
    if uv:
        layer=data.uv_layers.new(name='UVMap')
        for face in data.polygons:
            for index in face.loop_indices:layer.data[index].uv=uv[data.loops[index].vertex_index]
    for face in data.polygons:face.use_smooth=smooth
    return obj


def curve(name,points,r,material,parent):
    data=bpy.data.curves.new(name,'CURVE');data.dimensions='3D'
    data.bevel_depth=r;data.bevel_resolution=1
    spline=data.splines.new('POLY');spline.points.add(len(points)-1)
    for point,p in zip(spline.points,points):point.co=(*xyz(p),1)
    obj=bpy.data.objects.new(name,data);bpy.context.scene.collection.objects.link(obj)
    return finish(obj,name,material,parent)


def optimize(root):
    # Apply surface modifiers and merge static meshes by parent/material.
    # Semantic groups and the rotor/canopy pivots stay editable.
    for obj in list(root.children_recursive):
        if obj.type not in {'MESH','CURVE'}:continue
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
        bpy.context.view_layer.objects.active=obj
        bpy.ops.object.convert(target='MESH')
    buckets={}
    for obj in root.children_recursive:
        if obj.type=='MESH':buckets.setdefault((obj.parent.name,obj.data.materials[0].name),[]).append(obj)
    for (parent,material),objects in buckets.items():
        if len(objects)<2:continue
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join();objects[0].name=parent+'__'+material


def pebble(name, p, size, material, parent):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, location=xyz(p))
    obj = bpy.context.object
    obj.scale = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish(obj, name, material, parent)
    for face in obj.data.polygons: face.use_smooth = True
    return obj


def round_rod(name, a, b, radius, material, parent):
    obj = rod(name, a, b, radius, material, parent, 24)
    for modifier in obj.modifiers:
        if modifier.type == 'BEVEL':
            modifier.width = min(radius*.65, .055)
            modifier.segments = 5
    return obj
