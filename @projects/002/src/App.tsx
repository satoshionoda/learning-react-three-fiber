import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  DepthOfFieldEffect,
  SMAAEffect,
} from "postprocessing";
import * as THREE from "three";
import { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setupRaycaster } from "@/functions/raycaster.ts";
import { initUI, Params } from "@/functions/ui.ts";
import { uniforms, updateUniforms } from "@/functions/uniformts.ts";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const mainScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 1);
const composer = new EffectComposer(renderer);
const bloom = new BloomEffect({ mipmapBlur: false, radius: 0.2, levels: 64 });
const smaa = new SMAAEffect();
//
let time = 0;

export const initApp = (container: HTMLElement) => {
  initScene(container);
  resetScene();

  initUI(resetScene);
  setupRaycaster(mainScene, mainCamera);
  setupOnResize(container);
  //

  onRender();
};

const updatePostProcessing = () => {
  bloom.intensity = Params.bloomIntensity;
  bloom.luminanceMaterial.threshold = Params.bloomThreshold;
  bloom.blendMode.opacity.value = Params.bloomOpacity;
};

const onRender = () => {
  time += 0.16;

  updatePostProcessing();
  updateUniforms(time);
  // renderer.render(mainScene, mainCamera);
  composer.render();
  window.requestAnimationFrame(onRender.bind(this));
};

const resetScene = () => {
  mainScene.children = [];
  addObjects();
  //
  resetComposer();
};

const resetComposer = () => {
  composer.passes = [];
  composer.addPass(new RenderPass(mainScene, mainCamera));
  composer.addPass(new EffectPass(mainCamera, smaa));
  composer.addPass(new EffectPass(mainCamera, bloom));
};

const addObjects = () => {
  const sphere = new THREE.IcosahedronGeometry(0.5, Params.point);
  // const mesh = new THREE.Mesh(sphere, new THREE.MeshNormalMaterial());
  // mainScene.add(mesh);
  const pointsMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: Params.blendMode as THREE.Blending,
  });
  const points = new THREE.Points(sphere, pointsMaterial);
  mainScene.add(points);
  //
};

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
  mainScene.background = new THREE.Color(0x000000);
  new OrbitControls(mainCamera, renderer.domElement);
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
