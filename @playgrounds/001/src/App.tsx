import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { renderFBO, setupFBO } from "@/functions/fbo.ts";
import { setupRaycaster } from "@/functions/raycaster.ts";
import { initUI } from "@/functions/ui.ts";
import { fboUniforms, uniforms } from "@/functions/uniformts.ts";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const mainScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

const onRender = () => {
  time += 0.16;
  //
  const { currentTexture, nextTexture } = renderFBO(renderer);
  renderer.setRenderTarget(null);
  renderer.render(mainScene, mainCamera);
  //
  uniforms.uTexture.value = nextTexture;
  fboUniforms.uCurrent.value = currentTexture;
  //
  uniforms.uTime.value = time;
  //
  fboUniforms.uTime.value = time;
  //
  window.requestAnimationFrame(onRender.bind(this));
};

const resetScene = () => {
  mainScene.children = [];
  addObjects();
  setupFBO();
  resetTexture();
  //
};

const addObjects = () => {
  // const geometry = makePlaneGeometry(Params.size);
  // const geom = new THREE.IcosahedronGeometry(0.5, 32);
  const geom = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(geom, material);
  mainScene.add(mesh);
  //
};

const resetTexture = () => {
  // const tex1 = getPointsOnSphere(Params.size);
  // const tex2 = getPointsOnSphere(Params.size);
  // uniforms.uTexture.value = tex1;
  // fboUniforms.uCurrent.value = tex1;
  // fboUniforms.uOriginalA.value = tex1;
  // fboUniforms.uOriginalB.value = tex2;
};

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
  resetTexture();
  new OrbitControls(mainCamera, renderer.domElement);
};

const setupOnResize = (container: HTMLElement) => {
  window.addEventListener("resize", () => () => resetMainCamera(container));
};
const resetMainCamera = (container: HTMLElement) => {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  renderer.setSize(width, height);
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
};
