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
let img1: HTMLImageElement;
let img2: HTMLImageElement;

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
  if (!(img1 && img2)) {
    window.requestAnimationFrame(onRender.bind(this));
    return;
  }
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
  //
};

const resetTexture = () => {
  if (img1 && img2) {
    const tex1 = makeTextureFromImgElement(img1, Params.size, Params.texSize, Params.probability);
    const tex2 = makeTextureFromImgElement(img2, Params.size, Params.texSize, Params.probability);
    uniforms.uTexture.value = tex1;
    fboUniforms.uCurrent.value = tex1;
    fboUniforms.uOriginalA.value = tex1;
    fboUniforms.uOriginalB.value = tex2;
  }
};

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
  Promise.all([loadImage("/logo.png"), loadImage("/super.png")]).then(([tex1, tex2]) => {
    img1 = tex1;
    img2 = tex2;
    resetTexture();
  });
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
