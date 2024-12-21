# CAMERA

##position
Uposition
-10.0x,5.0y,8.1z

##rotation
Rotation magnitude
1.07 rad (61.04°) | X: -31.51°, Y: -46.41°, Z: -24.06°


# FPS
15


# SCENE
environmentIntensity: 1
visible: true

dynamic environmental mapping also known as Dynamic Environment Reflection
dynamic environmental mapping: null



# TIME
_Utime
00: 00: 40: 22


# Loading manager
onProgress: true

manager.itemEnd
[[FunctionLocation]]: chunk-DEEFU7IG.js?v=bb477238:25284
[[Prototype]]: ƒ ()
[[Scopes]]: Scopes[3]
  0: Closure (LoadingManager) {scope: LoadingManager, isLoading: false, itemsLoaded: 4, itemsTotal: 4, urlModifier: undefined, …}
  1: Module {_box$1: Box3, empty3dTexture: Data3DTexture, _v2$1: _Vector3, resolveIncludes: ƒ, generateCubeUVSize: ƒ, …}
  2: Global {window: Window, self: Window, document: doc



# DRACO LOADER
KHR_draco_mesh_compression

decoderConfig: wasmBinary: ArrayBuffer(285747)
  byteLength: 285747,
  detached: false,
  maxByteLength: 285747,
  resizable: false,
  [[Prototype]]: ArrayBuffer,
  [[Int8Array]]: Int8Array(285747),
  [[Uint8Array]]: Uint8Array(285747),
  [[ArrayBufferByteLength]]: 285747,
  [[ArrayBufferData]]: 2591

workerLimit: 4
workerNextTaskID: 2
workerPool: [Worker]

# GLTFLoader

dracoLoader: (incluye el anterior)
ktx2Loader: null



# CONTROLS
Camera panning controls 
  LEFT: 'ArrowRight', 
	UP: 'ArrowDown', 
	RIGHT: 'ArrowRight', 
	BOTTOM: 'ArrowLeft'

wheel - zoom
zoom: 13.8
ZOOM: 
controls.autoRotateSpeed = 0.1;
controls.dampingFactor = 0.1;
controls.keyPanSpeed = 1.2;

zoom: 	const distance = camera.position.distanceTo(controls.target);

maxPolarAngle: 3.141592653589793
maxTargetRadius: Infinity



# BASE GEOMETRY
instance: _BufferGeometry
count: 730639
instances 
BufferGeometry {
  uuid: "57587a9b-5097-4346-8adb-991865ecf26c",
  type: "BufferGeometry",
  name: "",
  id: 3,
  isBufferGeometry: true,
  count: 730639,
  attributes: {
    position: { isBufferAttribute: true, name: "", array: Float32Array(2191917), itemSize: 3, count: 730639 },
    normal: { isBufferAttribute: true, name: "", array: Float32Array(2191917), itemSize: 3, count: 730639 },
    uv: { isBufferAttribute: true, name: "", array: Float32Array(1461278), itemSize: 2, count: 730639 }
  },
  boundingBox: { isBox3: true, min: _Vector3, max: _Vector3 },
  boundingSphere: { isSphere: true, center: _Vector3, radius: 11.39617084098337 },
  drawRange: { start: 0, count: Infinity },
  groups: [],
  index: { isBufferAttribute: true, name: "", array: Uint32Array(2097183), itemSize: 1, count: 2097183 },
  morphAttributes: {},
  morphTargetsRelative: false,
  userData: {}
}

# GLTF (GL Transmission Format)
baseGeometry.instance = gltf.scene.children[0].geometry;
baseGeometry.count = baseGeometry.instance.attributes.position.count;
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));

Asset Information:
  Generator: "Khronos glTF Blender I/O v4.2.70"
  Version: "2.0"

KHR_binary_glTF:
  GLTFBinaryExtension:
    Body: ArrayBuffer(4330068 bytes)
    ByteLength: 4330068
    Detached: false
    MaxByteLength: 4330068
    Resizable: false
    Int8Array: Int8Array(4330068)
    Uint8Array: Uint8Array(4330068)
    Int16Array: Int16Array(2165034)
    Int32Array: Int32Array(1082517)
    ArrayBufferByteLength: 4330068
    ArrayBufferData: 20805

  Content (JSON):
    {
    
      "accessors": [
        {"componentType": 5126, "count": 730639, "max": [7.69, 4.19, 4.86], "min": [-9.84, -8.05, -3.03], "type": "VEC3"},
        {"componentType": 5126, "count": 730639, "type": "VEC3"},
        {"componentType": 5126, "count": 730639, "type": "VEC2"},
        {"componentType": 5125, "count": 2097183, "type": "SCALAR"}
      ],
      "bufferViews": [{"buffer": 0, "byteLength": 4330065, "byteOffset": 0}],
      "buffers": [{"byteLength": 4330068}]
    }

Header:
  Length: 4331044
  Magic: "glTF"
  Version: 2
  Name: "KHR_binary_glTF"


console.log(baseParticlesTexture.image);
Particle texture : image.data {
data: Float32Array(2924100), width: 855, height: 855
byteLength: 11696400
detached: false
maxByteLength: 11696400
resizable: false }



Data engine
