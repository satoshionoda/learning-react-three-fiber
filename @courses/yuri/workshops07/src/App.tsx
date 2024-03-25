import { makeTextureFromImgElement } from "@utils/getDataTextureFromImage.ts";
import { loadImage } from "@utils/loadImage.ts";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { renderFBO, setupFBO } from "@/functions/fbo.ts";
import { setupRaycaster } from "@/functions/raycaster.ts";
import { initUI, Params } from "@/functions/ui.ts";
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
  const { currentTexture, nextTexture } = renderFBO(renderer);
  renderer.setRenderTarget(null);
  renderer.render(mainScene, mainCamera);
  //
  uniforms.uTexture.value = nextTexture;
  fboUniforms.uCurrent.value = currentTexture;
  //
  uniforms.uTime.value = time;
  uniforms.uPointSize.value = Params.pointSize;
  uniforms.uPointAlpha.value = Params.pointAlpha;
  //
  fboUniforms.uTime.value = time;
  fboUniforms.uProgress.value = Params.progress;
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
  const geometry = makePlaneGeometry(Params.size);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  mainScene.add(points);
  points.rotation.y = 0.01;
  const axesHelper = new THREE.AxesHelper(5);
  mainScene.add(axesHelper);
  //
};

const resetTexture = () => {
  const tex1 = getPointsOnSphere(Params.size);
  const tex2 = getPointsOnSphere(Params.size);
  uniforms.uTexture.value = tex1;
  fboUniforms.uCurrent.value = tex1;
  fboUniforms.uOriginalA.value = tex1;
  fboUniforms.uOriginalB.value = tex2;
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

const getPointsOnSphere = (size: number) => {
  const number = size * size;
  const data = new Float32Array(4 * number);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;

      // generate point on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1); //
      // let phi = Math.random()*Math.PI; //
      const x = (Math.sin(phi) * Math.cos(theta)) / 2;
      const y = (Math.sin(phi) * Math.sin(theta)) / 2;
      const z = Math.cos(phi) / 2;

      data[4 * index] = x;
      data[4 * index + 1] = y;
      data[4 * index + 2] = z;
      data[4 * index + 3] = (Math.random() - 0.5) * 0.01;
    }
  }

  const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  dataTexture.needsUpdate = true;

  return dataTexture;
};
