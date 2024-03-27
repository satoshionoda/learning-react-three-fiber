import * as THREE from "three";

const dummyTexture = new THREE.DataTexture(
  new Float32Array(4),
  1,
  1,
  THREE.RGBAFormat,
  THREE.FloatType
);
type Val<T extends number | THREE.DataTexture | THREE.Vector3 | THREE.Vector2> = { value: T };
type MainUniforms = {
  uTime: Val<number>;
  uTexture: Val<THREE.DataTexture>;
};
type FBOUniforms = {
  uTime: Val<number>;
  uMouse: Val<THREE.Vector3>;
  uCurrent: Val<THREE.DataTexture>;
  uOriginal: Val<THREE.DataTexture>;
};
export const uniforms: MainUniforms = {
  uTime: { value: 0 },
  uTexture: { value: dummyTexture },
};
export const fboUniforms: FBOUniforms = {
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3(0, 0, 0) },
  uCurrent: { value: dummyTexture },
  uOriginal: { value: dummyTexture },
};
