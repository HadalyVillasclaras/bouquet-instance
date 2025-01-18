export const dataSources = [
  // GLOBALS
  { url: '/data/globals.json', elementId: 'obj-globals' },

  // THREE.JS
  { url: '/data/scene.json', elementId: 'obj-scene' },
  { url: '/data/camera.json', elementId: 'obj-camera' },
  { url: '/data/orbit_controls.json', elementId: 'obj-orbit' },
  { url: '/data/webgl_render.json', elementId: 'obj-render' },
  { url: '/data/webgl_render_programs.json', elementId: 'obj-render-programs' },
  { url: '/data/webgl_render_state.json', elementId: 'obj-render-state' },
  { url: '/data/loading_manager.json', elementId: 'obj-manager' },

  // LOADERS
  { url: '/data/loader_draco.json', elementId: 'obj-draco' },
  { url: '/data/loader_gltf.json', elementId: 'obj-gltf' },

  // MODEL GLTF // INSTANCE
  { url: '/data/instance.json', elementId: 'obj-inst' },

  { url: '/data/instance_parser.json', elementId: 'obj-inst-parser' },
  { url: '/data/instance_parser_extensions.json', elementId: 'obj-inst-ext' },
  { url: '/data/instance_parser_extensions_draco.json', elementId: 'obj-inst-ext-draco' },
  { url: '/data/instance_parser_extensions_binary.json', elementId: 'obj-inst-ext-binary' },
  { url: '/data/instance_parser_plugins.json', elementId: 'obj-inst-parser-plugins' },

  { url: '/data/instance_geometry.json', elementId: 'obj-inst-geo' },
  { url: '/data/instance_geometry_attributes.json', elementId: 'obj-inst-geo-atts' },
  { url: '/data/instance_material.json', elementId: 'obj-inst-mat' },
  { url: '/data/instance_mesh.json', elementId: 'obj-inst-mesh' },


  // GPU COMPUTATION
  { url: '/data/gpu_computation.json', elementId: 'obj-gpu-comp' },
  { url: '/data/gpu_computation_render_targets.json', elementId: 'obj-gpu-render-targets' },
  { url: '/data/gpu_data_texture.json', elementId: 'obj-gpu-texture' },
  { url: '/data/gpu_shader_material.json', elementId: 'obj-gpu-material' },
  { url: '/data/gpu_particles_variables.json', elementId: 'obj-particles-uniforms' },

  // PARTICLES 
  { url: '/data/particles_geometry.json', elementId: 'obj-particles-geo' },
  { url: '/data/particles_geometry_attributes.json', elementId: 'obj-particles-geo-att' },

  { url: '/data/particles_material.json', elementId: 'obj-particles-material' },
  { url: '/data/particles_material_variables.json', elementId: 'obj-particles-material-uni' },
  { url: '/data/particles_points.json', elementId: 'obj-particles-points' },
];