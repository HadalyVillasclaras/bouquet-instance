// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', init);
// } else {
//   init();
// }

export function init() {
  const scrollContainer = document.querySelector('.scroll-cnt');
  if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (event) => { }, true);
  } 

 

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
    { url: '../data/instance_geometry_attributes.json', elementId: 'obj-inst-geo-atts' },
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

  const fetchPromises = dataSources.map(source => {
    return fetchJsonData(source.url, source.elementId);
  });

  Promise.all(fetchPromises).then(() => {

    setTimeout(() => {
      setVisibleData();
    }, 3000);

    setTimeout(() => {
      setupAutoScroll();
    }, 4000);
  });
}

window.addEventListener('resize', () => {
  clearTimeout(autoScrollTimeout);
  autoScrollTimeout = setTimeout(setupAutoScroll, 5000);
});

// auto scroll
function setupAutoScroll() {
  const classSelector = window.innerWidth >= 1225 ? '.scroll-cnt.s-data-cnt' : '.scroll-cnt.s-data-grid';
  autoScroll(classSelector);
}

let autoScrollInterval;
let autoScrollTimeout;

function autoScroll(classSelector) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const intervals = new Map();
  const step = isSafari ? 1 : 0.5;
  const minDelay = isSafari ? 60 : 30;
  const maxDelay = isSafari ? 100 : 80;
  const scrollContainers = document.querySelectorAll(classSelector);

  const manageScroll = (container, isActiveRef, articlesContainer, index, delay, lastTime) => {
    const now = performance.now();
    if (isActiveRef.isActive && now - lastTime >= delay) {
      container.scrollTop += step;
      const clonedArticlesContainer = document.getElementById(`ch-b-${index}`);
      if (clonedArticlesContainer) {
        const secondDivTop = clonedArticlesContainer.getBoundingClientRect().top - container.getBoundingClientRect().top;
        if (secondDivTop <= 0) {
          container.scrollTop = articlesContainer.offsetTop;
        }
      }
      lastTime = now;
    }
    if (intervals.has(container)) {
      requestAnimationFrame(() => manageScroll(container, isActiveRef, articlesContainer, index, delay, lastTime));
    }
  };

  scrollContainers.forEach((container, index) => {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    const articlesContainer = container.firstElementChild;
    articlesContainer.id = `ch-a-${index}`;
    manageCloning(container, articlesContainer, index);

    let isActiveRef = { isActive: true }; 

    if (intervals.has(container)) {
      cancelAnimationFrame(intervals.get(container));
    }
    intervals.set(container, requestAnimationFrame(() => manageScroll(container, isActiveRef, articlesContainer, index, delay, performance.now())));

    container.addEventListener('mouseenter', () => { isActiveRef.isActive = false; });
    container.addEventListener('mouseleave', () => { isActiveRef.isActive = true; });
  });
}



function manageCloning(container, articlesContainer, index) {
  const existingClone = document.getElementById(`ch-b-${index}`);
  if (window.innerWidth >= 1225 && !existingClone) {
    const clonedArticlesContainer = articlesContainer.cloneNode(true);
    clonedArticlesContainer.id = `ch-b-${index}`;
    clonedArticlesContainer.classList.add("s-data-clnd");
    container.appendChild(clonedArticlesContainer);
  } else if (window.innerWidth < 1225 && existingClone) {
    existingClone.remove();
  }
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

function setVisibleData() {
  const element = document.querySelector('.s-data-grid');
  if (element) {
    element.style.opacity = '1';
  }

  setTimeout(() => {
    const menuAndPanels = document.querySelector('.s-menu-panels');
    if (menuAndPanels) {
      menuAndPanels.style.opacity = '1';
    }
  }, 1000);
}
