import { makeDataTexture } from "@utils/makeDataTexture.ts";
import * as THREE from "three";
import { Params } from "@/functions/ui.ts";

const originalData = makeDataTexture(Params.size);
type Val<T extends number | THREE.DataTexture | THREE.Vector3 | THREE.Vector2> = { value: T };
type MainUniforms = {
  time: Val<number>;
  uTexture: Val<THREE.DataTexture>;
  uPointSize: Val<number>;
  uPointAlpha: Val<number>;
};
type FBOUniforms = {
  time: Val<number>;
  uProgress: Val<number>;
  uMouse: Val<THREE.Vector3>;
  uCurrent: Val<THREE.DataTexture>;
  uOriginalA: Val<THREE.DataTexture>;
  uOriginalB: Val<THREE.DataTexture>;
};
export const uniforms: MainUniforms = {
  time: { value: 0 },
  uTexture: { value: originalData },
  uPointSize: { value: Params.pointSize },
  uPointAlpha: { value: Params.pointAlpha },
};
export const fboUniforms: FBOUniforms = {
  time: { value: 0 },
  uProgress: { value: 0 },
  uMouse: { value: new THREE.Vector3(0, 0, 0) },
  uCurrent: { value: originalData },
  uOriginalA: { value: originalData },
  uOriginalB: { value: originalData },
};
