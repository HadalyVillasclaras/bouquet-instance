document.addEventListener("DOMContentLoaded", function () {
  const dataSources = [
    { url: '../data/globals.json', elementId: 'obj-globals' },


    { url: '../data/scene.json', elementId: 'obj-scene' },
    { url: '../data/camera.json', elementId: 'obj-camera' },
    { url: '../data/orbit_controls.json', elementId: 'obj-orbit' },
    { url: '../data/webgl_render.json', elementId: 'obj-render' },
    { url: '../data/loading_manager.json', elementId: 'obj-manager' },

    
    { url: '../data/loader_draco.json', elementId: 'obj-draco' },
    { url: '../data/loader_gltf.json', elementId: 'obj-gltf' }, 
    

    { url: '../data/instance_parser_extensions.json', elementId: 'obj-inst-ext' },
    { url: '../data/instance_geometry.json', elementId: 'obj-inst-geo' },
    { url: '../data/instance_material.json', elementId: 'obj-inst-mat' },
    { url: '../data/instance_parser.json', elementId: 'obj-inst-parser' },


    // GPU COMPUTATION
    { url: '../data/gpu_computation.json', elementId: 'obj-gpu-comp' }



  ];

  dataSources.forEach(source => {
    fetchJsonData(source.url, source.elementId);
  });
});

function fetchJsonData(url, elementId) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayObjectStyleJson(data, elementId);
    })
    .catch(error => {
      console.error(`Failed to load data from ${url}: ${error.message}`);
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = `Failed to load the data: ${error.message}`;
      }
    });
}

function displayObjectStyleJson(obj, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const formatted = formatObjectStyle(obj, 0);
  element.textContent = formatted;
}

function formatObjectStyle(obj, indentLevel) {
  const indent = ' '.repeat(indentLevel * 2);
  let result = '';

  for (const key in obj) {
    const value = obj[key];
    const formattedKey = key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${indent}${formattedKey}: {\n${formatObjectStyle(value, indentLevel + 0.5)}${indent}}\n`;
    } else if (Array.isArray(value)) {
      const arrayContent = value.map(v => {
        if (typeof v === 'object' && v !== null) {
          const objectContent = formatObjectStyle(v, indentLevel + 1.7); 
          return `${indent}  {\n${objectContent}${indent}  }`; 
        } else {
          return `${indent}  ${removeQuotes(JSON.stringify(v))}`; 
        }
      }).join(',\n');
      result += `${indent}${formattedKey}: [\n${arrayContent}\n${indent}]\n`;
    } else {
      result += `${indent}${formattedKey}: ${removeQuotes(JSON.stringify(value))}\n`;
    }
  }

  return result;
}



function removeQuotes(value) {
  if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}
