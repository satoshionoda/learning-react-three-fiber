import * as THREE from "three";
import { Params } from "@/functions/ui.ts";
import { fboUniforms } from "@/functions/uniformts.ts";
import fboFragmentShader from "@/shaders/fboFragment.glsl";
import fboVertexShader from "@/shaders/fboVertex.glsl";

const fboScene = new THREE.Scene();
const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
const fboRenderTargetA = new THREE.WebGLRenderTarget(Params.size, Params.size, {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
});
const fboRenderTargetB = fboRenderTargetA.clone();

export const setupFBO = () => {
  fboRenderTargetA.setSize(Params.size, Params.size);
  fboRenderTargetB.setSize(Params.size, Params.size);
  fboScene.children = [];
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
//
let useTargetAForCurrent = true;
export const renderFBO = (renderer: THREE.WebGLRenderer) => {
  const currentTarget = useTargetAForCurrent ? fboRenderTargetA : fboRenderTargetB;
  const nextTarget = useTargetAForCurrent ? fboRenderTargetB : fboRenderTargetA;
  renderer.setRenderTarget(currentTarget);
  renderer.render(fboScene, fboCamera);
  useTargetAForCurrent = !useTargetAForCurrent;
  const currentTexture = currentTarget.texture as THREE.DataTexture;
  const nextTexture = nextTarget.texture as THREE.DataTexture;
  return { currentTexture, nextTexture };
};
