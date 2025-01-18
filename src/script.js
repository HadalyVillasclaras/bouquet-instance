import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import GUI from 'lil-gui'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'
import DataUpdater from './js/DataUpdater.js';
import { getRotation, getFPS } from './js/helpers.js';
import { controlsSetUp, guiSetUp, geometryParticlesSetUp, managerSetUp, baseParticlesSetUp} from './js/animationSetUp.js';
import './js/dataDisplay.js';
import './js/elementsDisplay.js';


/**
 * Globals
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(window.devicePixelRatio, 2)
}

// Min and Max camera panning
const minPan = new THREE.Vector3( - 2, - 2, - 2 );
const maxPan = new THREE.Vector3( 2, 2, 2 );

// Styles
const bgColor = "#f4f4f4";
const color1 = "#0e083a";
const color2 = "#172574";
const color3 = "#0e083a";

// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Base
 */
// Scene
const scene = new THREE.Scene();

// Manager
const manager = new THREE.LoadingManager();
managerSetUp(manager);

// Loaders
const dracoLoader = new DRACOLoader(manager)
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Model
 */
const gltf = await gltfLoader.loadAsync('/models/bouquet.glb');


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-10, 5.0, 8.1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controlsSetUp(controls);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor(bgColor); 

/**
 * Base Geometry
 */
const baseGeometry = {}
baseGeometry.instance = gltf.scene.children[0].geometry;
baseGeometry.count = baseGeometry.instance.attributes.position.count;

/**
 * GPU Compute
 */
// Setup
const gpgpu = {};
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer);

const baseParticlesTexture = gpgpu.computation.createTexture();

// Base particles
baseParticlesSetUp(baseGeometry, baseParticlesTexture)

// Particles variables
gpgpu.particlesVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticlesTexture)
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable]);

// Uniforms
gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture);
gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.35);
gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(1.28);
gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(1);

//Init
gpgpu.computation.init()

/**
 * Particles
 */
const particles = {}

// Geometry
const particleUvArray = new Float32Array(baseGeometry.count * 2);
const sizesArray = new Float32Array(baseGeometry.count);

geometryParticlesSetUp(gpgpu, particleUvArray, sizesArray);

particles.geometry = new THREE.BufferGeometry();
particles.geometry.setDrawRange(0, baseGeometry.count);
particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particleUvArray, 2));
particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));

// Material
particles.material = new THREE.ShaderMaterial({
	vertexShader: particlesVertexShader,
	fragmentShader: particlesFragmentShader,
	uniforms:
	{
		uSize: new THREE.Uniform(0.018),
		uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
		uParticlesTexture: new THREE.Uniform(),
		uColor1: { value: new THREE.Color(color1) },
		uColor2: { value: new THREE.Color(color2) },
		uColor3: { value: new THREE.Color(color3) },
	},
	// transparent: true,
	// blending: THREE.MultiplyBlending,
})

// Points
particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

/**
 * GUI
 */
// const gui = new GUI({ width: 340 })

// guiSetUp(
// 	gui,
// 	particles.material.uniforms.uSize, 
// 	gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, 
// 	gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 
// 	gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency
// );

/**
 * Animate
 */
const clock = new THREE.Clock()

// throttle
const interval = 60;
let lastTime = 0;
let previousTime = 0;
let animationFrameId = null;

const uiUpdater = new DataUpdater();

document.getElementById('dt-toggle-rotate-dir').addEventListener('click', () => {
  uiUpdater.setRotationDirection(controls);
});

let lastZoom = 0;

const animate = (time) => {
	animationFrameId = requestAnimationFrame(animate);

	if (time < lastTime + interval) {
		return;
	}
	
	// ZOOM 
	const distance = Math.round(camera.position.distanceTo(controls.target));
	if (distance !== lastZoom) {
			uiUpdater.setZoom(distance);
			lastZoom = distance;
	}

	const currentRotation = {
		x: parseFloat(camera.rotation.x.toFixed(2)),
		y: parseFloat(camera.rotation.y.toFixed(2)),
		z: parseFloat(camera.rotation.z.toFixed(2))
	};
	
	// UI Setters
	const rotationValues = getRotation(currentRotation);
	if (rotationValues) {
		uiUpdater.setRotation(rotationValues);
	}

	const fps = getFPS(1000);
	if (fps !== null) {
		uiUpdater.setFPS(fps);
	}
	uiUpdater.setCameraPosition(camera.position.x, camera.position.y, camera.position.z);
	uiUpdater.setTime(clock.getElapsedTime());


	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	lastTime = time;

	// Orbit Controls
	controls.target.clamp(minPan, maxPan); //Limit camera panning
	controls.update()

	// GPGPU Update
	gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime * 0.5;
	gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime * 0.5;
	gpgpu.computation.compute();
	particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;

	renderer.render(scene, camera);
}

animate();
// scene.visible = false;
// Objects
console.log(manager);

console.log(scene);
console.log(camera);
console.log(controls);
console.log(renderer);

console.log(dracoLoader);
console.log(gltfLoader);

console.log(gltf); // Loaded model
console.log(baseGeometry); //instance: gltf.scene.children[0].geometry

console.log(gpgpu);

// //particles
console.log(particles);
// console.log(particles.geometry); // particles.geometry = new THREE.BufferGeometry();
// console.log(particles.material); // new THREE.ShaderMaterial



window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

	// Materials
	particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(sizes.pixelRatio)
})
console.log(particles.geometry.attributes.aParticlesUv.array.buffer.byteLength);

