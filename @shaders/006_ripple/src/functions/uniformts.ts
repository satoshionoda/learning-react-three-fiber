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
  uProgress: Val<number>;
  uShowUV: Val<boolean>;
  uDistortionAmount: Val<number>;
  uMx1: Val<number>;
  uMy1: Val<number>;
  uMx2: Val<number>;
  uMy2: Val<number>;
  uMx3: Val<number>;
  uMy3: Val<number>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uScreenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uVirtualCursor: { value: new THREE.Vector3() },
  uImgA: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uImgB: { value: new THREE.DataTexture(new Uint8Array(0), 0, 0) },
  uProgress: { value: 0 },
  uShowUV: { value: Params.showUv },
  uDistortionAmount: { value: Params.distortion },
  uMx1: { value: Params.mx1 },
  uMy1: { value: Params.my1 },
  uMx2: { value: Params.mx2 },
  uMy2: { value: Params.my2 },
  uMx3: { value: Params.mx3 },
  uMy3: { value: Params.my3 },
};

export const updateUniforms = (time: number) => {
  const BASE_HEIGHT = 1300;
  //

  uniforms.uTime.value = time;
  uniforms.uShowUV.value = Params.showUv;
  uniforms.uDistortionAmount.value = Params.distortion;
  uniforms.uMx1.value = Params.mx1;
  uniforms.uMy1.value = Params.my1;
  uniforms.uMx2.value = Params.mx2;
  uniforms.uMy2.value = Params.my2;
  uniforms.uMx3.value = Params.mx3;
  uniforms.uMy3.value = Params.my3;

  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
