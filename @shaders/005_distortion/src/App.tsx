import * as THREE from "three";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";
import { setupRaycaster } from "@/functions/raycaster.ts";
import { initUI } from "@/functions/ui.ts";
import { uniforms, updateUniforms } from "@/functions/uniformts.ts";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const clock = new THREE.Clock(true);
const mainScene = new THREE.Scene();
const mainCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 1);

//
let time = 0;

const loader = new THREE.TextureLoader();
loader.load("/assets/img5.jpg", (tex) => {
  uniforms.uImgA.value = tex as THREE.DataTexture;
});

export const initApp = (container: HTMLElement) => {
  initScene(container);
  resetScene();

  const { fpsGraph } = initUI(resetScene);
  setupRaycaster(mainScene, mainCamera);
  setupOnResize(container);
  //

  onRender(fpsGraph);
};

const updatePostProcessing = () => {};

const onRender = (fpsGraph: FpsGraphBladeApi) => {
  fpsGraph.begin();
  clock.getDelta();
  time = clock.elapsedTime;

  updatePostProcessing();
  updateUniforms(time);
  renderer.render(mainScene, mainCamera);
  fpsGraph.end();
  window.requestAnimationFrame(onRender.bind(this, fpsGraph));
};

const resetScene = () => {
  mainScene.children = [];
  addObjects();
};

const addObjects = () => {
  const plane = new THREE.PlaneGeometry(1, 1, 1, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  });
  const mesh = new THREE.Mesh(plane, mat);
  mainScene.add(mesh);
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
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  uniforms.uDPI.value = window.devicePixelRatio;
  renderer.setSize(width, height);
  mainCamera.updateProjectionMatrix();
};
