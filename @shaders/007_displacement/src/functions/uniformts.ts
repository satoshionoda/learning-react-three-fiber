import * as THREE from "three";
import { Params } from "@/functions/ui.ts";

type GradationPoint = { color: THREE.Vector4; position: number };
type Val<
  T extends
    | number
    | boolean
    | THREE.DataTexture
    | THREE.Vector3
    | THREE.Vector2
    | THREE.Color
    | GradationPoint[],
> = {
  value: T;
};
type MainUniforms = {
  uDPI: Val<number>;
  uScreenSize: Val<THREE.Vector2>;
  uTime: Val<number>;
  uMouse: Val<THREE.Vector3>;
  uVirtualCursor: Val<THREE.Vector3>;
  uImgA: Val<THREE.DataTexture>;
  uImgB: Val<THREE.DataTexture>;
  uMask: Val<THREE.DataTexture>;
  uShowUV: Val<boolean>;
  uParam1: Val<number>;
  uParam2: Val<number>;
  uParam3: Val<number>;
  uParam4: Val<number>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uScreenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uVirtualCursor: { value: new THREE.Vector3() },
  uImgA: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uImgB: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uMask: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uShowUV: { value: false },
  uParam1: { value: Params.param1 },
  uParam2: { value: Params.param2 },
  uParam3: { value: Params.param3 },
  uParam4: { value: Params.param4 },
};

export const updateUniforms = (time: number) => {
  uniforms.uTime.value = time;
  uniforms.uShowUV.value = Params.showUv;
  uniforms.uParam1.value = Params.param1;
  uniforms.uParam2.value = Params.param2;
  uniforms.uParam3.value = Params.param3;
  uniforms.uParam4.value = Params.param4;

  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
