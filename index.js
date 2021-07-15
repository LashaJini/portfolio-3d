import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { addSpaceWarp, addSocialButtons, addGlowingText } from "./static/js";
import gsap from "gsap";
import * as dat from "dat.gui";
import "./static/css/global.css";

import vertexShader from "./shaders/glowText/vertex.glsl";
import fragmentShader from "./shaders/glowText/fragment.glsl";

const canvas = document.querySelector(".scene");
const size = { width: window.innerWidth, height: window.innerHeight };
const callbacks = [];

const gui = new dat.GUI();
if (!window.location.hash.includes("#debug")) {
  gui.hide();
}

const ENTIRE_SCENE = 0;
const BLOOM_SCENE = 1;

const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const materials = {};

const params = {
  bloomStrength: 1.24,
  bloomThreshold: 0,
  bloomRadius: 0.2,
};

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

window.addEventListener("resize", function () {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size.width, size.height);

  bloomComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bloomComposer.setSize(size.width, size.height);

  finalComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  finalComposer.setSize(size.width, size.height);
});

/////////////
//  Scene  //
/////////////

const scene = new THREE.Scene();
window.scene = scene;
scene.userData.size = size;

const axes = new THREE.AxesHelper(2);
// scene.add(axes);

////////////////
//  Renderer  //
////////////////

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(size.width, size.height);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
// renderer.xr.enabled = true;

//////////////
//  Camera  //
//////////////

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.01,
  100
);
camera.position.set(-10.76, 7.15, 12.15);
camera.layers.enable(BLOOM_SCENE);
scene.add(camera);
gsap.to(camera.position, { duration: 2, x: 0, y: 0.5, z: 5.89 }).then(() => {
  controls.maxDistance = 7.5;
  controls.minDistance = 3.5;
  controls.minAzimuthAngle = -Math.PI / 6;
  controls.maxAzimuthAngle = Math.PI / 6;
  controls.minPolarAngle = 1.09;
  controls.maxPolarAngle = 2.07;
});

//////////////////////
//  PostProcessing  //
//////////////////////

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(size.width, size.height),
  3.5,
  0.4,
  0
);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const finalPass = new ShaderPass(
  new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uBloomTexture: { value: bloomComposer.renderTarget2.texture },
      uBaseTexture: { value: null },
    },
  }),
  "uBaseTexture"
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer(renderer);
finalComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
finalComposer.setSize(size.width, size.height);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);

const smaaPass = new SMAAPass();
finalComposer.addPass(smaaPass);

//////////////
//  Lights  //
//////////////

scene.add(new THREE.AmbientLight("#404040", 1.0));

////////////////
//  Controls  //
////////////////

let controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
// window.controls = controls;

const animateSpaceWarp = addSpaceWarp(scene, ENTIRE_SCENE, gui);
callbacks.push(animateSpaceWarp);

addSocialButtons(scene, BLOOM_SCENE, gui, 1).then((animate) =>
  callbacks.push(animate)
);

addGlowingText(scene, BLOOM_SCENE, "109149", gui).then((textMesh) =>
  scene.add(textMesh)
);

///////////
//  GUI  //
///////////

const glowGUI = gui.addFolder("Glow");

glowGUI
  .add(params, "bloomStrength")
  .min(0)
  .max(5)
  .step(0.01)
  .onChange((state) => (bloomPass.strength = state));
glowGUI
  .add(params, "bloomRadius")
  .min(0)
  .max(5)
  .step(0.01)
  .onChange((state) => (bloomPass.radius = state));
glowGUI
  .add(params, "bloomThreshold")
  .min(0)
  .max(5)
  .step(0.01)
  .onChange((state) => (bloomPass.threshold = state));

function render() {
  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
}

function darkenNonBloomed(obj) {
  if (bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

function arRenderLoop() {
  renderer.setAnimationLoop(function () {
    callbacks.forEach((cb) => cb());
    controls.update();
    render();
  });
}

let animationId = null;
function renderLoop() {
  let lastTime = performance.now();
  const tick = (currTime) => {
    const delta = currTime - lastTime;
    if (delta >= 16) {
      callbacks.forEach((cb) => cb());

      controls.update();
      render();

      lastTime = currTime;
    }

    animationId = requestAnimationFrame(tick);
  };
  tick();
}

renderLoop();

// const arButton = ARButton.createButton(finalComposer.renderer);
// document.body.appendChild(arButton);
// arButton.onclick = function () {
//   if (renderer.xr.isPresenting) {
//     cancelAnimationFrame(animationId);
//     animationId = null;
//     arRenderLoop();
//     console.log("using AR render loop");
//   } else if (animationId !== null) {
//     renderLoop();
//     console.log("using render loop");
//   }
// };
// arRenderLoop();
// renderLoop();
