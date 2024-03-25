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
};
type FBOUniforms = {
  time: { value: number };
  uMouse: { value: THREE.Vector3 };
  uCurrent: { value: THREE.DataTexture };
  uOriginal: { value: THREE.DataTexture };
  uForceA: { value: number };
  uForceB: { value: number };
  uForceSpeed: { value: number };
};
//
let time = 0;
const pane = new Pane();
const Params = { size: 128, pointSize: 2, forceA: 1, forceB: 0.2, forceSpeed: 0.1 };
const originalData = makeDataTexture(Params.size);
const uniforms: MainUniforms = {
  time: { value: 0 },
  uTexture: { value: originalData },
  uPointSize: { value: Params.pointSize },
};
const fboUniforms: FBOUniforms = {
  time: { value: 0 },
  uMouse: { value: new THREE.Vector3(0, 0, 0) },
  uCurrent: { value: originalData },
  uOriginal: { value: originalData },
  uForceA: { value: Params.forceA },
  uForceB: { value: Params.forceB },
  uForceSpeed: { value: Params.forceSpeed },
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

export const initApp = (container: HTMLElement) => {
  initUI();
  initScene(container);
  resetScene();
  //
  window.addEventListener("resize", () => onResize(container));
  window.addEventListener("mousemove", onMouseMove);
  render();
};

let useTargetAForCurrent = true;
const render = () => {
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
  //
  fboUniforms.time.value = time / 10;
  fboUniforms.uForceA.value = Params.forceA;
  fboUniforms.uForceB.value = Params.forceB;
  fboUniforms.uForceSpeed.value = Params.forceSpeed;
  //

  useTargetAForCurrent = !useTargetAForCurrent;

  window.requestAnimationFrame(render.bind(this));
};

const initUI = () => {
  pane.addBinding(Params, "size", { min: 4, max: 2048, step: 4 }).on("change", () => {
    const texture = makeDataTexture(Params.size);
    uniforms.uTexture.value = texture;
    fboUniforms.uOriginal.value = texture;
    fboRenderTargetA.setSize(Params.size, Params.size);
    fboRenderTargetB.setSize(Params.size, Params.size);
    resetScene();
  });
  pane.addBinding(Params, "pointSize", { min: 0.01, max: 5, step: 0.01 });
  pane.addBinding(Params, "forceA", { min: 0.01, max: 10, step: 0.01 });
  pane.addBinding(Params, "forceB", { min: 0.01, max: 2, step: 0.01 });
  pane.addBinding(Params, "forceSpeed", { min: 0.01, max: 2, step: 0.01 });
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
};

const addObjects = () => {
  const geometry = makePlaneGeometry(Params.size);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  const points = new THREE.Points(geometry, material);
  mainScene.add(points);
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

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
  new OrbitControls(mainCamera, renderer.domElement);
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
