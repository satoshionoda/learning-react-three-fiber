import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";
import { makeDataTexture } from "@/functions/makeDataTexture.ts";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

type MaterialUniforms = {
  time: { value: number };
  uTexture: { value: THREE.DataTexture };
  uPointSize: { value: number };
};
//
let time = 0;
const pane = new Pane();
const Params = { size: 32, pointSize: 1 };
const uniforms: MaterialUniforms = {
  time: { value: 0 },
  uTexture: { value: makeDataTexture(Params.size) },
  uPointSize: { value: Params.pointSize },
};
const rootScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

export const initApp = (container: HTMLElement) => {
  initUI();
  initScene(container);
  resetScene();

  window.addEventListener("resize", () => onResize(container));
  render();
};

const initUI = () => {
  pane.addBinding(Params, "size", { min: 4, max: 2048, step: 4 }).on("change", () => {
    uniforms.uTexture.value = makeDataTexture(Params.size);
    resetScene();
  });
  pane.addBinding(Params, "pointSize", { min: 0.01, max: 5, step: 0.01 });
};

const render = () => {
  time += 0.16;
  uniforms.time.value = time / 10;
  uniforms.uPointSize.value = Params.pointSize;
  renderer.render(rootScene, mainCamera);
  window.requestAnimationFrame(render.bind(this));
};

const resetScene = () => {
  rootScene.children = [];
  addObjects();
};

const addObjects = () => {
  const geometry = makePlaneGeometry(Params.size);

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  const points = new THREE.Points(geometry, material);
  rootScene.add(points);
};

const initScene = (container: HTMLElement) => {
  container.appendChild(renderer.domElement);
  resetMainCamera(container);
  mainCamera.position.z = 1;
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
