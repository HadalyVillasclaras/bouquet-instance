import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import GUI from 'lil-gui'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Load model
 */
const gltf = await gltfLoader.loadAsync('./mfs.glb');

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(window.devicePixelRatio, 2)
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4.5, 4, 15);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

// Background color
renderer.setClearColor('#f4f4f4');


/**
 * Base Geometry
 */
const baseGeometry = {}
baseGeometry.instance = gltf.scene.children[0].geometry;
console.log(baseGeometry.instance);
baseGeometry.count = baseGeometry.instance.attributes.position.count;

/**
 * GPU Compute
 */
// Setup
const gpgpu = {};
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer)

// Base particles
const baseParticlesTexture = gpgpu.computation.createTexture(); 

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
		uColor1: { value: new THREE.Color("#0e083a") },
		uColor2: { value: new THREE.Color("#172074") },
		uColor3: { value: new THREE.Color("#0e083a") },
	},
	// transparent: true,
	// blending: THREE.MultiplyBlending,
})

// Points
particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

/**
 * Tweaks
 */
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')

gui
	.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, 'value')
	.min(0)
	.max(10)
	.name('uFlowFieldInfluence');

gui
	.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value')
	.min(0)
	.max(10)
	.name('uFlowFieldStrength');

gui
	.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, 'value')
	.min(0)
	.max(1)
	.step(0.001)
	.name('uFlowFieldFrequency');

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// throttle
const fps = 30; 
const interval = 1000 / fps;
let lastTime = 0;
let animationFrameId = null;

const animate = (time) => {
	animationFrameId = requestAnimationFrame(animate);
	console.log(controls);

	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	lastTime = time;

	// Update controls
	controls.update()

	// GPGPU Update
	gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime;
	gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime;
	gpgpu.computation.compute();
	particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;

	renderer.render(scene, camera);
}

animate();