import * as THREE from "three";
import { Params } from "@/functions/ui.ts";

type Val<
  T extends number | boolean | THREE.DataTexture | THREE.Vector3 | THREE.Vector2 | THREE.Color,
> = {
  value: T;
};
type MainUniforms = {
  uDPI: Val<number>;
  uTime: Val<number>;
  uMouse: Val<THREE.Vector3>;
  uVirtualCursor: Val<THREE.Vector3>;
  uColorA: Val<THREE.Color>;
  uColorB: Val<THREE.Color>;
  uMaxPointSize: Val<number>;
  uMinPointSize: Val<number>;
  uTranslation: Val<number>;
  uBaseTranslation: Val<number>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uVirtualCursor: { value: new THREE.Vector3() },
  uColorA: { value: new THREE.Color(Params.colorA) },
  uColorB: { value: new THREE.Color(Params.colorB) },
  uMaxPointSize: { value: Params.maxPointSize },
  uMinPointSize: { value: Params.minPointSize },
  uTranslation: { value: Params.translation },
  uBaseTranslation: { value: Params.pointShift },
};

export const updateUniforms = (time: number) => {
  const BASE_HEIGHT = 1300;
  uniforms.uDPI.value = window.devicePixelRatio;
  uniforms.uTime.value = time;
  uniforms.uColorA.value.set(Params.colorA);
  uniforms.uColorB.value.set(Params.colorB);
  uniforms.uMaxPointSize.value = Params.maxPointSize;
  uniforms.uMinPointSize.value = Params.minPointSize;
  uniforms.uTranslation.value = Params.translation;
  uniforms.uBaseTranslation.value = Params.pointShift;
  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
