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
  uTime: Val<number>;
  uScreenSize: Val<THREE.Vector2>;
  uMouse: Val<THREE.Vector3>;
  uVirtualCursor: Val<THREE.Vector3>;
  uImgA: Val<THREE.DataTexture>;
  uImgB: Val<THREE.DataTexture>;
  uProgress: Val<number>;
  uShowUV: Val<boolean>;
  uDistortionAmount: Val<number>;
  uMaxDistortion: Val<number>;
  uRippleCenter: Val<THREE.Vector2>;
  uRippleSpeed: Val<number>;
  uRippleFrequency: Val<number>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uScreenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uVirtualCursor: { value: new THREE.Vector3() },
  uImgA: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uImgB: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uProgress: { value: 0 },
  uShowUV: { value: Params.showUv },
  uDistortionAmount: { value: 0 },
  uMaxDistortion: { value: Params.distortion },
  uRippleCenter: { value: new THREE.Vector2(0, 0) },
  uRippleSpeed: { value: 1 },
  uRippleFrequency: { value: 1 },
};

export const updateUniforms = (time: number) => {
  const BASE_HEIGHT = 1300;
  //

  uniforms.uTime.value = time;
  uniforms.uShowUV.value = Params.showUv;
  uniforms.uMaxDistortion.value = Params.distortion;
  uniforms.uRippleSpeed.value = Params.speed;
  uniforms.uRippleFrequency.value = Params.frequency;
  // uniforms.uDistortionAmount.value = Params.distortion;
  // uniforms.uProgress.value = Params.progress;

  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
