import * as THREE from "three";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph";
import { loadTextures, showNext } from "@/functions/carousel.ts";
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

//
let time = 0;

export const initApp = async (container: HTMLElement) => {
  await loadTextures();
  initScene(container);
  resetScene();

  const { fpsGraph } = initUI(resetScene);
  setupRaycaster(mainScene, mainCamera);
  setupOnResize(container);
  setupClickEvent(container);
  //

  onRender(fpsGraph);
};

const onRender = (fpsGraph: FpsGraphBladeApi) => {
  fpsGraph.begin();
  clock.getDelta();
  time = clock.elapsedTime;

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
};

const setupOnResize = (container: HTMLElement) => {
  window.addEventListener("resize", () => resetMainCamera(container));
};
const resetMainCamera = (container: HTMLElement) => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  uniforms.uDPI.value = window.devicePixelRatio;
  uniforms.uScreenSize.value.set(width, height);
  renderer.setSize(width, height);
  mainCamera.updateProjectionMatrix();
};

const setupClickEvent = (container: HTMLElement) => {
  container.addEventListener("click", (e) => {
    const { clientY, clientX } = e;
    const { top, left, width, height } = container.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;
    showNext(x, y);
  });
};
