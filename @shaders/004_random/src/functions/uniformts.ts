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
  uPointAlpha: Val<number>;
  uMaxPointSize: Val<number>;
  uMinPointSize: Val<number>;
  uWaveSize: Val<number>;
  uWaveComplexity: Val<number>;
  uWaveSpeedX: Val<number>;
  uWaveSpeedY: Val<number>;
  uInverseFresnel: Val<boolean>;
  uFresnelPower: Val<number>;
  uIor: Val<number>;
  uGamma: Val<number>;
  uColorA: Val<THREE.Color>;
  uColorB: Val<THREE.Color>;
  uColorC: Val<THREE.Color>;
  uColorD: Val<THREE.Color>;
  uStepA: Val<number>;
  uStepB: Val<number>;
  uStepC: Val<number>;
  uStepD: Val<number>;
  uUseColorA: Val<boolean>;
  uUseColorB: Val<boolean>;
  uUseColorC: Val<boolean>;
  uUseColorD: Val<boolean>;
};

export const uniforms: MainUniforms = {
  uDPI: { value: window.devicePixelRatio },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector3() },
  uVirtualCursor: { value: new THREE.Vector3() },
  uPointAlpha: { value: Params.pointAlpha },
  uMaxPointSize: { value: Params.maxPointSize },
  uMinPointSize: { value: Params.minPointSize },
  uWaveSize: { value: Params.waveSize },
  uWaveComplexity: { value: Params.waveComplexity },
  uWaveSpeedX: { value: Params.waveSpeedX },
  uWaveSpeedY: { value: Params.waveSpeedY },
  uInverseFresnel: { value: true },
  uFresnelPower: { value: Params.fresnelPower },
  uIor: { value: 1.33 },
  uGamma: { value: 1.0 },
  uColorA: { value: new THREE.Color(Params.colorA) },
  uColorB: { value: new THREE.Color(Params.colorB) },
  uColorC: { value: new THREE.Color(Params.colorC) },
  uColorD: { value: new THREE.Color(Params.colorD) },
  uStepA: { value: Params.stepA },
  uStepB: { value: Params.stepB },
  uStepC: { value: Params.stepC },
  uStepD: { value: Params.stepD },
  uUseColorA: { value: Params.useColorA },
  uUseColorB: { value: Params.useColorB },
  uUseColorC: { value: Params.useColorC },
  uUseColorD: { value: Params.useColorD },
};

const virtualCursor = new THREE.Vector3();
export const updateUniforms = (time: number) => {
  const BASE_HEIGHT = 1300;
  const pointSizeRatio = window.innerHeight / BASE_HEIGHT;
  //

  uniforms.uTime.value = time;
  uniforms.uPointAlpha.value = Params.pointAlpha;
  uniforms.uMaxPointSize.value = Params.maxPointSize * pointSizeRatio;
  uniforms.uMinPointSize.value = Params.minPointSize * pointSizeRatio;
  uniforms.uWaveSize.value = Params.waveSize;
  uniforms.uWaveComplexity.value = Params.waveComplexity;
  uniforms.uWaveSpeedX.value = Params.waveSpeedX;
  uniforms.uWaveSpeedY.value = Params.waveSpeedY;
  uniforms.uInverseFresnel.value = Params.inverseFresnel;
  uniforms.uFresnelPower.value = Params.fresnelPower;
  uniforms.uIor.value = Params.ior;
  uniforms.uGamma.value = Params.gamma;
  uniforms.uColorA.value = new THREE.Color(Params.colorA);
  uniforms.uColorB.value = new THREE.Color(Params.colorB);
  uniforms.uColorC.value = new THREE.Color(Params.colorC);
  uniforms.uColorD.value = new THREE.Color(Params.colorD);
  uniforms.uStepA.value = Params.stepA;
  uniforms.uStepB.value = Params.stepB;
  uniforms.uStepC.value = Params.stepC;
  uniforms.uStepD.value = Params.stepD;
  uniforms.uUseColorA.value = Params.useColorA;
  uniforms.uUseColorB.value = Params.useColorB;
  uniforms.uUseColorC.value = Params.useColorC;
  uniforms.uUseColorD.value = Params.useColorD;

  const vc = uniforms.uVirtualCursor.value;
  const m = uniforms.uMouse.value;
  vc.x += (m.x - vc.x) * 0.05;
  vc.y += (m.y - vc.y) * 0.05;
  vc.z += (m.z - vc.z) * 0.05;
};
