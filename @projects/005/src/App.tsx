import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";
import { sampleSurface } from "@/functions/meshSurfaceSampler.ts";
import { setupRaycaster } from "@/functions/raycaster.ts";
import { initUI, Params } from "@/functions/ui.ts";
import { uniforms, updateUniforms } from "@/functions/uniformts.ts";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const mainScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 1);
const composer = new EffectComposer(renderer);
const bloom = new BloomEffect({ mipmapBlur: false, radius: 0.2, levels: 64 });
const smaa = new SMAAEffect();
//
let model: GLTF | null = null;
let time = 0;

export const initApp = async (container: HTMLElement) => {
  model = await loadScene();
  initScene(container);
  resetScene();

  const { fpsGraph } = initUI(resetScene);
  setupRaycaster(mainScene, mainCamera);
  setupOnResize(container);
  //

  onRender(fpsGraph);
};

const loadScene = async (): Promise<GLTF> => {
  const loader = new GLTFLoader();
  return await loader.loadAsync("/assets/dna.gltf");
};

const updatePostProcessing = () => {
  bloom.intensity = Params.bloomIntensity;
  bloom.luminanceMaterial.threshold = Params.bloomThreshold;
  bloom.blendMode.opacity.value = Params.bloomOpacity;
};

const onRender = (fpsGraph: FpsGraphBladeApi) => {
  fpsGraph.begin();
  renderer.setClearColor(Params.backgroundColor, 1);
  time += 0.16;
  updatePostProcessing();
  updateUniforms(time);
  composer.render();
  fpsGraph.end();
  const points = mainScene.children[0] as THREE.Points;
  // points.quaternion.slerp(mainCamera.quaternion, 0.1);
  points.rotateY(Params.rotationSpeed);
  window.requestAnimationFrame(onRender.bind(this, fpsGraph));
};

const resetScene = () => {
  mainScene.children = [];
  console.log(model);
  if (!model) return;
  const camera = model.cameras[0] as THREE.PerspectiveCamera;
  mainCamera.copy(camera, true);

  addObjects();
  resetComposer();
};

const resetComposer = () => {
  composer.passes = [];
  composer.addPass(new RenderPass(mainScene, mainCamera));
  composer.addPass(new EffectPass(mainCamera, smaa));
  composer.addPass(new EffectPass(mainCamera, bloom));
};

const addObjects = () => {
  if (!model) return;
  const mesh = model.scene.children[0] as THREE.Mesh;
  const pointsGeometry = sampleSurface(mesh, Params.count);
  const pointsMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    blending: Params.blendMode as THREE.Blending,
    depthTest: false,
    depthWrite: false,
  });
  const wrapper = new THREE.Object3D();
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  wrapper.add(points);
  wrapper.position.copy(mesh.position);
  wrapper.rotation.copy(mesh.rotation);
  mainScene.add(wrapper);
  //
};

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
  // mainScene.background = new THREE.Color(0x000000);
  // new OrbitControls(mainCamera, renderer.domElement);
};

const setupOnResize = (container: HTMLElement) => {
  window.addEventListener("resize", () => resetMainCamera(container));
};
const resetMainCamera = (container: HTMLElement) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  uniforms.uDPI.value = window.devicePixelRatio;
  renderer.setSize(width, height);
  composer.setSize(width, height);
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
};
