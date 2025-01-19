<?php

$dataSources = [
  "globals" => "./data/globals.json",
  "scene" => "./data/scene.json",
  "camera" => "./data/camera.json",
  "orbit_controls" => "./data/orbit_controls.json",
  "webgl_render" => "./data/webgl_render.json",
  "webgl_render_programs" => "./data/webgl_render_programs.json",
  "webgl_render_state" => "./data/webgl_render_state.json",
  "loading_manager" => "./data/loading_manager.json",
  "loader_draco" => "./data/loader_draco.json",
  "loader_gltf" => "./data/loader_gltf.json",
  "instance" => "./data/instance.json",
  "instance_parser" => "./data/instance_parser.json",
  "instance_parser_extensions" => "./data/instance_parser_extensions.json",
  "instance_parser_extensions_draco" => "./data/instance_parser_extensions_draco.json",
  "instance_parser_extensions_binary" => "./data/instance_parser_extensions_binary.json",
  "instance_parser_plugins" => "./data/instance_parser_plugins.json",
  "instance_geometry" => "./data/instance_geometry.json",
  "instance_geometry_attributes" => "./data/instance_geometry_attributes.json",
  "instance_material" => "./data/instance_material.json",
  "instance_mesh" => "./data/instance_mesh.json",
  "gpu_computation" => "./data/gpu_computation.json",
  "gpu_computation_render_targets" => "./data/gpu_computation_render_targets.json",
  "gpu_data_texture" => "./data/gpu_data_texture.json",
  "gpu_shader_material" => "./data/gpu_shader_material.json",
  "gpu_particles_variables" => "./data/gpu_particles_variables.json",
  "particles_geometry" => "./data/particles_geometry.json",
  "particles_geometry_attributes" => "./data/particles_geometry_attributes.json",
  "particles_material" => "./data/particles_material.json",
  "particles_material_variables" => "./data/particles_material_variables.json",
  "particles_points" => "./data/particles_points.json",
];


function formatJson($obj, $indentLevel = 0)
{
  $indent = str_repeat(' ', $indentLevel * 2);
  $result = '';

  foreach ($obj as $key => $value) {
    $formattedKey = is_string($key) ? $key : json_encode($key);
    if (is_array($value) || is_object($value)) {
      if (array_keys($value) !== range(0, count($value) - 1)) {
        $result .= "$indent$formattedKey: {\n" . formatJson($value, $indentLevel + 0.5) . "$indent}\n";
      } else {
        $arrayContent = array_map(function ($v) use ($indent, $indentLevel) {
          return formatJson($v, $indentLevel + 1.7);
        }, $value);
        $result .= "$indent$formattedKey: [\n" . implode(",\n", $arrayContent) . "\n$indent]\n";
      }
    } else {
      $formattedValue = formatValue($value);
      $result .= "$indent$formattedKey: $formattedValue\n";
    }
  }
  return $result;
}

function formatValue($value)
{
  if (is_string($value)) {
    return '"' . addslashes($value) . '"';
  } elseif (is_bool($value)) {
    return $value ? 'TRUE' : 'FALSE';
  } elseif (is_null($value)) {
    return 'NULL';
  }
  return $value;
}

function isAssoc(array $arr)
{
  if ([] === $arr) return false;
  return array_keys($arr) !== range(0, count($arr) - 1);
}


$formattedData = [];

foreach ($dataSources as $key => $filePath) {
    $jsonContent = file_get_contents($filePath);
    $jsonData = json_decode($jsonContent, true);
    $formattedData[$key] = formatJson($jsonData, 0);
}