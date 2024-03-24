import {
  getDataTextureFromImage,
  makeTextureFromImgElement,
} from "@utils/getDataTextureFromImage.ts";
import { loadImage } from "@utils/loadImage.ts";
import { makeDataTexture } from "@utils/makeDataTexture.ts";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import fboFragmentShader from "@/shaders/fboFragment.glsl";
import fboVertexShader from "@/shaders/fboVertex.glsl";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

type MainUniforms = {
  time: { value: number };
  uTexture: { value: THREE.DataTexture };
  uPointSize: { value: number };
  uPointAlpha: { value: number };
};
type FBOUniforms = {
  time: { value: number };
  uProgress: { value: number };
  uMouse: { value: THREE.Vector3 };
  uCurrent: { value: THREE.DataTexture };
  uOriginalA: { value: THREE.DataTexture };
  uOriginalB: { value: THREE.DataTexture };
};
//
let time = 0;
const pane = new Pane();
const Params = {
  size: 1024,
  texSize: 512,
  pointSize: 0.01,
  pointAlpha: 0.1,
  probability: 0.95,
  progress: 0,
};
const originalData = makeDataTexture(Params.size);
const uniforms: MainUniforms = {
  time: { value: 0 },
  uTexture: { value: originalData },
  uPointSize: { value: Params.pointSize },
  uPointAlpha: { value: Params.pointAlpha },
};
const fboUniforms: FBOUniforms = {
  time: { value: 0 },
  uProgress: { value: 0 },
  uMouse: { value: new THREE.Vector3(0, 0, 0) },
  uCurrent: { value: originalData },
  uOriginalA: { value: originalData },
  uOriginalB: { value: originalData },
};
const mainScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//
const fboScene = new THREE.Scene();
const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
const fboRenderTargetA = new THREE.WebGLRenderTarget(Params.size, Params.size, {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
});
const fboRenderTargetB = fboRenderTargetA.clone();
//
const raycaster = new THREE.Raycaster();
const raycasterMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
);
//
let img1: HTMLImageElement;
let img2: HTMLImageElement;

export const initApp = (container: HTMLElement) => {
  initUI();
  initScene(container);
  resetScene();

  //
  window.addEventListener("resize", () => onResize(container));
  window.addEventListener("mousemove", onMouseMove);
  onRender();
};

let useTargetAForCurrent = true;
const onRender = () => {
  if (!(img1 && img2)) {
    window.requestAnimationFrame(onRender.bind(this));
    return;
  }
  time += 0.16;
  const currentTarget = useTargetAForCurrent ? fboRenderTargetA : fboRenderTargetB;
  const nextTarget = useTargetAForCurrent ? fboRenderTargetB : fboRenderTargetA;
  renderer.setRenderTarget(currentTarget);
  renderer.render(fboScene, fboCamera);
  renderer.setRenderTarget(null);
  renderer.render(mainScene, mainCamera);
  //
  uniforms.uTexture.value = nextTarget.texture as THREE.DataTexture;
  fboUniforms.uCurrent.value = currentTarget.texture as THREE.DataTexture;
  //

  uniforms.time.value = time / 10;
  uniforms.uPointSize.value = Params.pointSize;
  uniforms.uPointAlpha.value = Params.pointAlpha;
  //
  fboUniforms.time.value = time / 10;
  fboUniforms.uProgress.value = Params.progress;
  //

  useTargetAForCurrent = !useTargetAForCurrent;

  window.requestAnimationFrame(onRender.bind(this));
};

const initUI = () => {
  pane.addBinding(Params, "size", { min: 4, max: 2048, step: 4 }).on("change", () => {
    fboRenderTargetA.setSize(Params.size, Params.size);
    fboRenderTargetB.setSize(Params.size, Params.size);
    resetScene();
  });
  pane.addBinding(Params, "texSize", { min: 4, max: 2048, step: 4 }).on("change", () => {
    resetScene();
  });
  pane.addBinding(Params, "probability", { min: 0.8, max: 1, step: 0.0001 }).on("change", () => {
    resetScene();
  });
  pane.addBinding(Params, "pointSize", { min: 0.01, max: 5, step: 0.01 });
  pane.addBinding(Params, "pointAlpha", { min: 0.05, max: 1, step: 0.01 });
  pane.addBinding(Params, "progress", { min: 0, max: 1, step: 0.01 });
};

const onMouseMove = (e: MouseEvent) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(x, y), mainCamera);
  const intersects = raycaster.intersectObjects([raycasterMesh]);
  if (intersects.length > 0) {
    fboUniforms.uMouse.value = intersects[0].point;
  }
};

const resetScene = () => {
  mainScene.children = [];
  fboScene.children = [];
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
  mainScene.add(raycasterMesh);
};

const setupFBO = () => {
  fboCamera.position.z = 1;
  fboCamera.lookAt(new THREE.Vector3(0, 0, 0));
  const geo = new THREE.PlaneGeometry(2, 2, 2, 2);
  // const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const mat = new THREE.ShaderMaterial({
    uniforms: fboUniforms,
    vertexShader: fboVertexShader,
    fragmentShader: fboFragmentShader,
  });
  const mesh = new THREE.Mesh(geo, mat);
  fboScene.add(mesh);
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
  const controls = new OrbitControls(mainCamera, renderer.domElement);
};
const onResize = (container: HTMLElement) => {
  resetMainCamera(container);
};

const resetMainCamera = (container: HTMLElement) => {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  renderer.setSize(width, height);
  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
};
