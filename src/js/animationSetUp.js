import { init } from "./dataDisplay";
// Manager set up
export function managerSetUp(manager) {
  manager.onLoad = function () {
    console.log('Loaded');
    document.querySelector('.webgl').classList.add('loaded');
    setTimeout(() => {
      init();
    }, 0);
  };
}

// Particle set up
export function baseParticlesSetUp(baseGeometry, baseParticlesTexture) {
  // Base particles
  for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
  
    const position = baseGeometry.instance.attributes.position.array;
    const color = baseParticlesTexture.image.data;
  
    // Position based on geometry -
    color[i4 + 0] = position[i3 + 0]; // R
    color[i4 + 1] = position[i3 + 1]; // G
    color[i4 + 2] = position[i3 + 2]; // B
    color[i4 + 3] = Math.random();    // A
  }
}

export function geometryParticlesSetUp(gpgpu, particleUvArray, sizesArray) {
for (let y = 0; y < gpgpu.size; y++) {
  for (let x = 0; x < gpgpu.size; x++) {
    const i = (y * gpgpu.size) + x;
    const i2 = i * 2;

    // Particles UV
    const uvX = (x + 0.5) / gpgpu.size;
    const uvY = (y + 0.5) / gpgpu.size;

    particleUvArray[i2 + 0] = uvX;
    particleUvArray[i2 + 1] = uvY;

    // Size
    sizesArray[i] = Math.random();
  }
}
}

// GUI set up
export function guiSetUp(gui, uSize, uFlowFieldInfluence, uFlowFieldStrength, uFlowFieldFrequency) {
  gui
    .add(uSize, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('uSize');

  gui
    .add(uFlowFieldInfluence, 'value')
    .min(0)
    .max(10)
    .name('uFlowFieldInfluence');

  gui
    .add(uFlowFieldStrength, 'value')
    .min(0)
    .max(10)
    .name('uFlowFieldStrength');

  gui
    .add(uFlowFieldFrequency, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('uFlowFieldFrequency');
}

// OrbitControls set up
export function controlsSetUp(controls) {
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
  controls.dampingFactor = 0.1;
  controls.keyPanSpeed = 1.2;
  controls.maxDistance = 18;
  controls.minDistance = 8;
  controls.rotateSpeed = 0.4;

  controls.maxPolarAngle = Math.PI / 1.2;  
  // controls.minPolarAngle = Math.PI / 4;
  
  controls.keys = {
    LEFT: 'ArrowRight',
    UP: 'ArrowDown',
    RIGHT: 'ArrowLeft',
    BOTTOM: 'ArrowUp'
  }

  initCameraPanningKeyEvents(controls);
}

function initCameraPanningKeyEvents(controls) {
  const arrow_keys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

  window.addEventListener('pointerdown', (event) => { }, false);
  window.addEventListener('pointerup', (event) => { }, false);
  window.addEventListener('wheel', (event) => { }, false);
  window.addEventListener('keydown', (event) => {
    if (arrow_keys.some(k => k === event.key) || event.ctrlKey || event.metaKey || event.shiftKey) {
      controls.listenToKeyEvents(window);
    }
  }, false);
  window.addEventListener('keyup', (event) => {
    if (arrow_keys.some(k => k === event.key)) {
      controls.stopListenToKeyEvents();
    }
  }, false);
}
