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
  uMouse: Val<THREE.Vector3>;
  uVirtualCursor: Val<THREE.Vector3>;
  uType: Val<number>;
  uRotation: Val<number>;
  uScale: Val<number>;
  uPoints: Val<GradationPoint[]>;
  uNumPoints: Val<number>;
  uOffsetSpeed: Val<number>;
  uRotationSpeed: Val<number>;
  uDither: Val<number>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uVirtualCursor: { value: new THREE.Vector3() },
  uType: { value: Params.type },
  uRotation: { value: Params.rotation },
  uScale: { value: Params.scale },
  uPoints: { value: [] },
  uNumPoints: { value: 0 },
  uOffsetSpeed: { value: Params.offsetSpeed },
  uRotationSpeed: { value: Params.rotationSpeed },
  uDither: { value: Params.dither },
};

const colorToVec4 = (str: string): THREE.Vector4 => {
  const color = new THREE.Color(str).convertLinearToSRGB();
  return new THREE.Vector4(color.r, color.g, color.b, 1);
};
export const updateUniforms = (time: number) => {
  const BASE_HEIGHT = 1300;
  //

  uniforms.uTime.value = time;
  uniforms.uType.value = Params.type;
  uniforms.uRotation.value = Params.rotation;
  uniforms.uScale.value = Params.scale;
  uniforms.uOffsetSpeed.value = Params.offsetSpeed;
  uniforms.uRotationSpeed.value = Params.rotationSpeed;
  uniforms.uDither.value = Params.dither;

  const allPoints: (GradationPoint & { enabled: boolean })[] = [
    { color: colorToVec4(Params.colorA), position: Params.stepA, enabled: Params.useColorA },
    { color: colorToVec4(Params.colorB), position: Params.stepB, enabled: Params.useColorB },
    { color: colorToVec4(Params.colorC), position: Params.stepC, enabled: Params.useColorC },
    { color: colorToVec4(Params.colorD), position: Params.stepD, enabled: Params.useColorD },
  ];

  const points: GradationPoint[] = allPoints
    .filter((p) => p.enabled)
    .map(({ enabled, ...rest }) => ({ ...rest }));
  const numPoints = points.length;
  const MAX_POINTS = 10;
  for (let i = points.length; i < MAX_POINTS; i++) {
    points.push({ color: colorToVec4("#0000FF"), position: 1 });
  }
  uniforms.uPoints.value = points;
  uniforms.uNumPoints.value = numPoints;

  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
