"""Author and render the Greeny garden study using Blender's bundled Python.

blender --background --factory-startup --python garden.py -- --size 1200 --samples 48
Outputs: four storyboard PNGs, editable .blend, animated .glb, model manifest.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path
import random
import sys
import time

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
RNG = random.Random(23)
MATERIALS = {}
GROUPS = {}


def linear(channel):
    return channel / 12.92 if channel < .04045 else ((channel + .055) / 1.055) ** 2.4


def material(name, hex_color, roughness=.75, metallic=0, emission=0):
    rgb = tuple(linear(int(hex_color[i:i + 2], 16) / 255) for i in (0, 2, 4))
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*rgb, 1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    if emission:
        shader.inputs['Emission Color'].default_value = (*rgb, 1)
        shader.inputs['Emission Strength'].default_value = emission
    MATERIALS[name] = mat
    return mat


def group(name, parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent = parent
    GROUPS[name] = obj
    return obj


def finish(obj, name, mat, parent, bevel=0):
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    obj.parent = parent
    if bevel:
        modifier = obj.modifiers.new('Soft miniature edges', 'BEVEL')
        modifier.width, modifier.segments = bevel, 3
        modifier = obj.modifiers.new('Weighted corner normals', 'WEIGHTED_NORMAL')
        modifier.keep_sharp = True
    return obj


def box(name, position, size, mat, parent, bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent, bevel)


def rod(name, start, end, radius, mat, parent, vertices=12):
    delta = Vector(end) - Vector(start)
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=delta.length,
                                      location=(Vector(start) + Vector(end)) / 2)
    obj = bpy.context.object
    obj.rotation_euler = delta.to_track_quat('Z', 'Y').to_euler()
    return finish(obj, name, mat, parent, .008 if radius > .04 else 0)


def pebble(name, position, size, mat, parent, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=position)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent)


def line(name, points, radius, mat, parent):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions, curve.resolution_u = '3D', 2
    curve.bevel_depth, curve.bevel_resolution = radius, 2
    spline = curve.splines.new('POLY')
    spline.points.add(len(points) - 1)
    for point, xyz in zip(spline.points, points):
        point.co = (*xyz, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.scene.collection.objects.link(obj)
    curve.materials.append(mat)
    obj.parent = parent
    return obj


def leaf(name, center, length, width, yaw, tilt, mat, parent):
    # A closed, slightly folded leaf. Its topology exports without textures.
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(0, 0, 0), (-width, length * .4, .025), (0, length, .08),
                     (width, length * .4, .025), (0, length * .45, .13),
                     (0, length * .45, -.02)], [],
                    [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4),
                     (1, 0, 5), (2, 1, 5), (3, 2, 5), (0, 3, 5)])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = center
    obj.rotation_euler = (tilt, 0, yaw)
    obj.parent = parent
    mesh.materials.append(mat)
    return obj


def lettuce(center, number, parent):
    for ring, count, length in [(0, 7, .38), (1, 5, .28), (2, 3, .18)]:
        for i in range(count):
            yaw = i * math.tau / count + ring * .45
            leaf(f'Lettuce_{number}_{ring}_{i}', (center[0], center[1], center[2] + ring * .05),
                 length, length * .43, yaw, .12 + ring * .32,
                 MATERIALS['Leaf_Light' if ring == 2 else 'Leaf_Mid' if i % 3 else 'Leaf_Dark'], parent)


def build_garden():
    root = group('Garden_Root')
    terrain = group('Terrain', root)
    beds = group('Planting_Beds', root)
    plants = group('Plants', root)
    path = group('Path', root)
    devices = group('Devices', root)
    box('Land_Earth', (0, 0, -.28), (7.8, 6.4, .6), MATERIALS['Earth'], terrain, .20)
    box('Land_Grass', (0, 0, .04), (7.76, 6.36, .18), MATERIALS['Grass'], terrain, .17)
    # Broad paths give the devices breathing room and keep the bed layout readable.
    box('Path_Crossing', (0, -.75, .145), (6.8, .75, .055), MATERIALS['Path'], path, .12)
    box('Path_Entry', (.65, -1.83, .15), (.82, 2.15, .055), MATERIALS['Path'], path, .10)
    for i in range(5):
        box(f'Entry_Paver_{i}', (.65, -2.6 + i * .38, .188), (.62, .29, .025),
            MATERIALS['Stone_Light'], path, .035)
    bed_specs = [('Herbs', (-2.05, .70), (1.9, 2.1)),
                 ('Greens', (.15, .75), (1.8, 2.2)),
                 ('Tomatoes', (-1.9, -2.05), (2.0, 1.25))]
    for name, (x, y), (w, h) in bed_specs:
        box(name + '_Frame', (x, y, .35), (w, h, .38), MATERIALS['Wood'], beds, .07)
        box(name + '_Soil', (x, y, .555), (w - .18, h - .18, .075), MATERIALS['Soil'], beds, .045)
        for side in [-1, 1]:
            box(name + f'_Rim_{side}', (x + side * (w / 2 - .05), y, .58),
                (.10, h, .08), MATERIALS['Wood_Light'], beds, .025)
        for row in range(3 if h > 2 else 2):
            for column in range(2 if w < 2 else 3):
                px = x + (column - (.5 if w < 2 else 1)) * (.65 if w < 2 else .53)
                py = y + (row - (1 if h > 2 else .5)) * (.58 if h > 2 else .45)
                lettuce((px, py, .61), f'{name}_{row}_{column}', plants)
    # Taller tomato silhouettes at the rear bed edge.
    for i, (x, y) in enumerate([(-2.35, -2.15), (-1.35, -2.15)]):
        rod(f'Tomato_Stake_{i}', (x, y, .6), (x, y, 1.60), .024, MATERIALS['Wood_Light'], plants)
        for j in range(5):
            z = .8 + j * .14
            yaw = j * 2.3
            leaf(f'Tomato_Leaf_{i}_{j}', (x, y, z), .33, .105, yaw, .20,
                 MATERIALS['Leaf_Dark'], plants)
        for j, dx in enumerate([-.16, .13]):
            pebble(f'Tomato_Fruit_{i}_{j}', (x + dx, y - .12, 1.05 + j * .19),
                   (.10, .10, .105), MATERIALS['Fruit'], plants, 2)
    tree = group('Fruit_Tree', root)
    rod('Tree_Trunk', (2.6, 1.85, .12), (2.55, 1.85, 1.6), .12, MATERIALS['Wood'], tree)
    for i, (dx, dy, dz, r) in enumerate([(-.35, 0, 1.8, .65), (.35, .12, 1.94, .69),
                                       (-.05, -.25, 2.3, .66), (.05, .30, 2.55, .60)]):
        rod(f'Tree_Branch_{i}', (2.55, 1.85, 1.3), (2.6 + dx, 1.85 + dy, dz), .055,
            MATERIALS['Wood'], tree)
        pebble(f'Tree_Crown_{i}', (2.6 + dx, 1.85 + dy, dz), (r, r * .85, r),
               MATERIALS['Leaf_Mid' if i % 2 else 'Leaf_Dark'], tree, 2)
    for i in range(6):
        angle = i * 2.4
        pebble(f'Tree_Fruit_{i}', (2.6 + .55 * math.cos(angle), 1.65 + .48 * math.sin(angle),
                                1.9 + .13 * (i % 3)), (.085, .085, .085), MATERIALS['Fruit'], tree, 2)
    # Low grasses and stones frame the land; its working area stays open.
    for i in range(16):
        x = RNG.uniform(-3.4, 3.4)
        y = RNG.choice([RNG.uniform(2.45, 2.85), RNG.uniform(-2.85, -2.7)])
        for j in range(3):
            leaf(f'Border_Grass_{i}_{j}', (x, y, .15), RNG.uniform(.18, .31), .035,
                 j * 2 + i, .65, MATERIALS['Leaf_Mid'], terrain)
    for i, xy in enumerate([(3.0, -.2), (3.25, -.4), (3.05, -.55), (-3.35, 1.9), (-3.15, 2.1)]):
        pebble(f'Garden_Stone_{i}', (*xy, .23), (.22, .17, .12), MATERIALS['Stone'], terrain)
    # Greeny's source deck uses a fork-shaped sensor as an illustrative reference.
    sensor = group('Sensor', devices)
    sx, sy = -.45, .15
    rod('Sensor_Soil_Probe', (sx, sy, .48), (sx, sy, .92), .055, MATERIALS['Graphite'], sensor)
    rod('Sensor_Body', (sx, sy, .82), (sx, sy, 1.5), .095, MATERIALS['Device_Green'], sensor, 20)
    rod('Sensor_Left_Fork', (sx, sy, 1.26), (sx - .27, sy, 1.58), .08,
        MATERIALS['Device_Green'], sensor, 20)
    rod('Sensor_Right_Fork', (sx, sy, 1.47), (sx + .13, sy, 1.78), .092,
        MATERIALS['Device_Green'], sensor, 20)
    pebble('Sensor_Light_Cap', (sx + .13, sy, 1.785), (.073, .073, .035),
           MATERIALS['Device_Cream'], sensor, 2)
    pebble('Sensor_Status', (sx, sy - .093, 1.19), (.023, .012, .023), MATERIALS['Signal'], sensor, 2)
    hub = group('Hub_Concept', devices)
    box('Hub_Platform', (2.15, -.15, .24), (.94, .75, .20), MATERIALS['Stone'], hub, .07)
    box('Hub_Housing', (2.15, -.15, .64), (.68, .48, .65), MATERIALS['Device_Cream'], hub, .11)
    box('Hub_Face', (2.15, -.398, .66), (.45, .018, .32), MATERIALS['Device_Green'], hub, .035)
    box('Hub_Status', (2.15, -.411, .69), (.16, .012, .025), MATERIALS['Signal'], hub, .008)
    for i in range(3):
        box(f'Hub_Vent_{i}', (2.497, -.14 + i * .075, .65), (.008, .035, .16),
            MATERIALS['Graphite'], hub, .008)
    sprinkler = group('Sprinkler', devices)
    wx, wy = -1.05, -.74
    rod('Sprinkler_Base', (wx, wy, .18), (wx, wy, .31), .16, MATERIALS['Graphite'], sprinkler, 24)
    rod('Sprinkler_Riser', (wx, wy, .29), (wx, wy, .83), .06, MATERIALS['Metal'], sprinkler, 20)
    rod('Sprinkler_Head', (wx, wy, .82), (wx, wy, .95), .115, MATERIALS['Graphite'], sprinkler, 24)
    rod('Sprinkler_Nozzle', (wx, wy - .10, .90), (wx, wy - .13, .90), .03,
        MATERIALS['Device_Cream'], sprinkler)
    # A short, grounded supply line makes the irrigation placement credible.
    line('Irrigation_Supply', [(-1.05, -.74, .18), (-1.05, -1.05, .18), (1.65, -1.05, .18),
                              (1.65, -.15, .18), (2.15, -.15, .18)], .018,
         MATERIALS['Graphite'], devices)
    indicator = group('Sensor_Indicator', root)
    indicator.location = (sx, sy, .62)
    points = [(.32 * math.cos(t * math.tau / 48), .32 * math.sin(t * math.tau / 48), 0)
              for t in range(49)]
    line('Sensor_Focus_Ring', points, .018, MATERIALS['Signal'], indicator)
    connection = group('Connection_FX', root)
    connection.location = (sx, sy, 1.22)
    for i in range(9):
        t = i / 8
        position = ((2.15 - sx) * t, (-.15 - sy) * t, .28 * math.sin(t * math.pi))
        pebble(f'Connection_Dot_{i}', position, (.027, .027, .027), MATERIALS['Signal'], connection, 2)
    water = group('Water_FX', root)
    water.location = (wx, wy, .96)
    for index, (tx, ty) in enumerate([(-2.5, .7), (-1.75, 1.4), (-.6, 1.55), (.55, .9), (.2, -.1)]):
        points = []
        for step in range(21):
            t = step / 20
            points.append(((tx - wx) * t, (ty - wy) * t,
                           -.32 * t + 1.1 * math.sin(math.pi * t)))
        line(f'Water_Jet_{index}', points, .012, MATERIALS['Water'], water)
        for j in range(3):
            t = .66 + j * .09
            pos = ((tx - wx) * t + .06, (ty - wy) * t,
                   -.32 * t + 1.1 * math.sin(math.pi * t) - .10)
            pebble(f'Water_Drop_{index}_{j}', pos, (.023, .023, .04), MATERIALS['Water'], water, 2)
    for obj, scales in [(indicator, [0.0001, 1, .0001, .0001]),
                        (connection, [.0001, 1, .0001, .0001]),
                        (water, [.0001, .0001, 1, .0001])]:
        for frame, scale in zip([1, 49, 97, 145], scales):
            obj.scale = (scale,) * 3
            obj.keyframe_insert('scale', frame=frame, group=obj.name)
    for frame, yaw in [(1, 0), (49, -12), (97, -24), (145, -28)]:
        root.rotation_euler.z = math.radians(yaw)
        root.keyframe_insert('rotation_euler', frame=frame, group='Garden turn')
    return root


def point_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def setup_scene(size, samples, device):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    if device == 'GPU':
        preferences = bpy.context.preferences.addons['cycles'].preferences
        preferences.compute_device_type = 'CUDA'
        preferences.get_devices()
        available = [d for d in preferences.devices if d.type == 'CUDA']
        if not available:
            raise RuntimeError('CUDA unavailable; rerun with --device CPU.')
        for entry in preferences.devices:
            entry.use = entry.type == 'CUDA'
        scene.cycles.device = 'GPU'
    else:
        scene.cycles.device = 'CPU'
    scene.render.resolution_x, scene.render.resolution_y = size, round(size * .78)
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.film_transparent = True
    scene.view_settings.view_transform = 'AgX'
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.65, .70, .60, 1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .3
    for name, pos, power, width, color in [
        ('Key', (-3, -4, 8), 1050, 5, (1, .91, .79)),
        ('Fill', (5, -1, 6), 400, 5, (.83, .91, 1)),
        ('Rim', (1, 5, 7), 650, 4, (1, 1, .88)),
    ]:
        data = bpy.data.lights.new(name, 'AREA')
        data.energy, data.shape, data.size, data.color = power, 'DISK', width, color
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
        obj.location = pos
        point_at(obj, (0, 0, .3))
    camera_data = bpy.data.cameras.new('Camera_Review')
    camera = bpy.data.objects.new('Camera_Review', camera_data)
    scene.collection.objects.link(camera)
    camera.location = (10, -13, 10.4)
    point_at(camera, (0, 0, .05))
    camera_data.type, camera_data.ortho_scale = 'ORTHO', 11.7
    scene.camera = camera
    scene.frame_start, scene.frame_end, scene.render.fps = 1, 145, 24
    return scene


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--size', type=int, default=1200)
    parser.add_argument('--samples', type=int, default=48)
    parser.add_argument('--device', choices=['GPU', 'CPU'], default='GPU')
    parser.add_argument('--shots', nargs='*', default=None, help='Optional shot IDs for a draft render.')
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
    started = time.perf_counter()
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for name, color in [('Earth', '353A2C'), ('Grass', '6C9537'), ('Path', 'B5BEA4'),
                        ('Stone_Light', 'D6DCCB'), ('Stone', '717B68'), ('Wood', '897859'),
                        ('Wood_Light', 'B3A181'), ('Soil', '463D2F'), ('Leaf_Light', 'AFD182'),
                        ('Leaf_Mid', '8EBE50'), ('Leaf_Dark', '4A6425'), ('Fruit', 'C59745'),
                        ('Graphite', '242424'), ('Device_Green', 'AFD182'), ('Device_Cream', 'F8FBF4')]:
        material(name, color)
    material('Metal', 'CBD4C1', .32, .65)
    material('Signal', 'CFE3B5', .45, emission=.25)
    material('Water', '8BC3D2', .25, emission=.08)
    root = build_garden()
    scene = setup_scene(args.size, args.samples, args.device)
    shots = json.loads((HERE / 'storyboard.json').read_text(encoding='utf8'))['shots']
    model_dir = HERE / 'model'
    render_dir = HERE / 'renders'
    model_dir.mkdir(exist_ok=True)
    render_dir.mkdir(exist_ok=True)
    # Export the model only: no render cameras, lights or world dependencies.
    scene.frame_set(1)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in root.children_recursive + [root]:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(filepath=str(model_dir / 'greeny-garden.glb'), export_format='GLB',
                              use_selection=True, export_apply=True, export_animations=True,
                              export_animation_mode='SCENE', export_anim_scene_split_object=False,
                              export_frame_range=True)
    for shot in shots:
        if args.shots and shot['id'] not in args.shots:
            continue
        scene.frame_set(shot['frame'])
        scene.render.filepath = str(HERE / shot['image'])
        bpy.ops.render.render(write_still=True)
    scene.frame_set(1)
    scene.render.filepath = '//../renders/01-garden.png'
    bpy.ops.object.select_all(action='DESELECT')
    root.select_set(True)
    bpy.context.view_layer.objects.active = root
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == 'VIEW_3D':
                area.spaces.active.shading.type = 'SOLID'
                area.spaces.active.shading.color_type = 'MATERIAL'
                area.spaces.active.region_3d.view_perspective = 'CAMERA'
    bpy.ops.wm.save_as_mainfile(filepath=str(model_dir / 'greeny-garden.blend'), compress=True)
    meshes = [obj for obj in root.children_recursive if obj.type == 'MESH']
    triangles = 0
    for obj in meshes:
        obj.data.calc_loop_triangles()
        triangles += len(obj.data.loop_triangles)
    manifest = {'blender': bpy.app.version_string, 'seed': 23, 'objects': len(root.children_recursive),
                'mesh_triangles_before_modifiers': triangles,
                'resolution': [scene.render.resolution_x, scene.render.resolution_y], 'samples': args.samples,
                'device': args.device, 'seconds': round(time.perf_counter() - started, 2),
                'units': 'Illustrative proportions, not manufacturing dimensions',
                'groups': list(GROUPS), 'animated_frames': [1, 49, 97, 145],
                'concept_geometry': ['Terrain and planting arrangement', 'Hub housing', 'Simplified sensor and sprinkler'],
                'source_reference': 'Original Greeny deck slides 6–7; sensor reference there is credited to Parrot Flower Power.',
                'source_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                'storyboard_sha256': hashlib.sha256((HERE / 'storyboard.json').read_bytes()).hexdigest()}
    (model_dir / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf8')
    print('GREENY_MODEL_COMPLETE', json.dumps(manifest))


if __name__ == '__main__':
    main()
