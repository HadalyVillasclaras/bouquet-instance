document.addEventListener("DOMContentLoaded", function () {
  const dataSources = [
    // GLOBALS
    { url: '../data/globals.json', elementId: 'obj-globals' },

    // THREE.JS
    { url: '../data/scene.json', elementId: 'obj-scene' },
    { url: '../data/camera.json', elementId: 'obj-camera' },
    { url: '../data/orbit_controls.json', elementId: 'obj-orbit' },
    { url: '../data/webgl_render.json', elementId: 'obj-render' },
    { url: '../data/webgl_render_programs.json', elementId: 'obj-render-programs' },
    { url: '../data/webgl_render_state.json', elementId: 'obj-render-state' },
    { url: '../data/loading_manager.json', elementId: 'obj-manager' },

    // LOADERS
    { url: '../data/loader_draco.json', elementId: 'obj-draco' },
    { url: '../data/loader_gltf.json', elementId: 'obj-gltf' },

    // MODEL GLTF // INSTANCE
    { url: '../data/instance.json', elementId: 'obj-inst' },

    { url: '../data/instance_parser.json', elementId: 'obj-inst-parser' },
    { url: '../data/instance_parser_extensions.json', elementId: 'obj-inst-ext' },
    { url: '../data/instance_parser_extensions_draco.json', elementId: 'obj-inst-ext-draco' },
    { url: '../data/instance_parser_extensions_binary.json', elementId: 'obj-inst-ext-binary' },
    { url: '../data/instance_parser_plugins.json', elementId: 'obj-inst-parser-plugins' },

    { url: '../data/instance_geometry.json', elementId: 'obj-inst-geo' },
    { url: '../data/instance_material.json', elementId: 'obj-inst-mat' },
    { url: '../data/instance_mesh.json', elementId: 'obj-inst-mesh' },


    // GPU COMPUTATION
    { url: '../data/gpu_computation.json', elementId: 'obj-gpu-comp' },
    { url: '../data/gpu_computation_render_targets.json', elementId: 'obj-gpu-render-targets' },
    { url: '../data/gpu_data_texture.json', elementId: 'obj-gpu-texture' },
    { url: '../data/gpu_shader_material.json', elementId: 'obj-gpu-material' },
    { url: '../data/gpu_particles_variables.json', elementId: 'obj-particles-uniforms' },

    // PARTICLES 
    { url: '../data/particles_geometry.json', elementId: 'obj-particles-geo' },
    { url: '../data/particles_geometry_attributes.json', elementId: 'obj-particles-geo-att' },

    { url: '../data/particles_material.json', elementId: 'obj-particles-material' },
    { url: '../data/particles_material_variables.json', elementId: 'obj-particles-material-uni' },
    { url: '../data/particles_points.json', elementId: 'obj-particles-points' },
  ];

  dataSources.forEach(source => {
    fetchJsonData(source.url, source.elementId);
  });

  // Toggle data button
  // const button = document.getElementById('btn-toggle-data');
  // if (button) {
  //   button.addEventListener('click', toggleData);
  // }



  // auto scroll
  function setupAutoScroll() {
    const classSelector = window.innerWidth >= 1225 ? '.scroll-cnt.s-data-cnt' : '.scroll-cnt.s-data-grid';
    autoScroll(classSelector);
  }

  setTimeout(setupAutoScroll, 3000);

  window.addEventListener('resize', () => {
    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = setTimeout(setupAutoScroll, 5000);
  });
});

let autoScrollInterval;
let autoScrollTimeout;

function autoScroll(classSelector) {
  if (autoScrollInterval) clearInterval(autoScrollInterval);

  const scrollContainers = document.querySelectorAll(classSelector);

  scrollContainers.forEach((container, index) => {
    let isActive = true;
    const step = 0.5;
    const minDelay = 60;
    const maxDelay = 120;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;

    const articlesContainer = container.firstElementChild;
    articlesContainer.id = `ch-a-${index}`;

    manageCloning(container, articlesContainer, index);

    autoScrollInterval = setInterval(() => {
      if (isActive) {
        container.scrollTop += step;
        const clonedArticlesContainer = document.getElementById(`ch-b-${index}`);
        if (clonedArticlesContainer) {
          const secondDivTop = clonedArticlesContainer.getBoundingClientRect().top - container.getBoundingClientRect().top;
          if (secondDivTop <= 0) {
            container.scrollTop = articlesContainer.offsetTop;
          }
        }
      }
    }, delay);

    container.addEventListener('mouseenter', () => {
      isActive = false;
    });

    container.addEventListener('mouseleave', () => {
      isActive = true;
    });
  });
}

function manageCloning(container, articlesContainer, index) {
  const existingClone = document.getElementById(`ch-b-${index}`);
  if (window.innerWidth >= 1225 && !existingClone) {
    const clonedArticlesContainer = articlesContainer.cloneNode(true);
    clonedArticlesContainer.id = `ch-b-${index}`;
    container.appendChild(clonedArticlesContainer);
  } else if (window.innerWidth < 1225 && existingClone) {
    existingClone.remove();
  }
}






function toggleData() {
  const elements = document.querySelectorAll('.data-tgl');

  elements.forEach(element => {
    if (element.classList.contains('visible')) {
      element.classList.remove('visible');
      element.style.display = 'none';
    } else {
      element.classList.add('visible');
      element.style.display = 'block';
    }
  });
}

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
      result += `${indent}${formattedKey}: {\n${formatObjectStyle(value, indentLevel + 1)}${indent}}\n`;
    } else if (Array.isArray(value)) {
      const arrayContent = value.map(v => {
        if (typeof v === 'object' && v !== null) {
          const objectContent = formatObjectStyle(v, indentLevel + 2);
          return `${indent}  {\n${objectContent}${indent}  }`;
        } else {
          return `${indent}  ${formatStringWithIndents(JSON.stringify(v), indentLevel + 2)}`;
        }
      }).join(',\n');
      result += `${indent}${formattedKey}: [\n${arrayContent}\n${indent}]\n`;
    } else {
      result += `${indent}${formattedKey}: ${formatStringWithIndents(JSON.stringify(value), indentLevel)}\n`;
    }
  }

  return result;
}

function formatStringWithIndents(str, indentLevel) {
  const indent = ' '.repeat(indentLevel * 2);
  return str.replace(/\n/g, '\n' + indent);
}


function removeQuotes(value) {
  if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}
