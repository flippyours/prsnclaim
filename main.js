import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const container = document.getElementById('container3D');
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Load model
const loader = new GLTFLoader();
let object;

loader.load('source/tshirt11.glb', function (gltf) {
  object = gltf.scene;
  object.scale.set(2, 2, 2);
  scene.add(object);

  // Center object
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);

  // Load texture
  const textureLoader = new THREE.TextureLoader();
  const newTexture = textureLoader.load('source/my_new_texture.png', () => {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase() === "tshirt") {
        child.material.map = newTexture;
        child.material.needsUpdate = true;
      }
    });
  }, undefined, (err) => {
    console.error("Gagal memuat tekstur:", err);
  });

}, undefined, function (error) {
  console.error('Gagal memuat model:', error);
});

// Lighting
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1.5);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  if (object) object.rotation.y += 0.01;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

animate();
