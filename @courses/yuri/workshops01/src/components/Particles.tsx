import { useFrame } from "@react-three/fiber";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import { useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FloatType,
  RGBAFormat,
  ShaderMaterial,
} from "three";
import fragmentShader from "@/shaders/fragment.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const makeDataTexture = (size: number) => {
  const count = size * size;
  const data = new Float32Array(4 * count);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      data[4 * index] = Math.random() * 2 - 1;
      data[4 * index + 1] = Math.random() * 2 - 1;
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 1;
    }
  }
  const dataTexture = new DataTexture(data, size, size, RGBAFormat, FloatType);
  dataTexture.needsUpdate = true;
  return dataTexture;
};
const makeShaderMaterial = (size: number) => {
  const material = new ShaderMaterial();
  material.vertexShader = vertexShader;
  material.fragmentShader = fragmentShader;
  material.uniforms = {
    time: { value: 0 },
    uTexture: { value: makeDataTexture(size) },
  };
  return material;
};

export const Particles = () => {
  const size = 32;
  const geometry = useMemo(() => makePlaneGeometry(size), []);
  const material = useMemo(() => makeShaderMaterial(size), []);
  useFrame((state) => {
    material.uniforms.time.value = state.clock.getElapsedTime();
  });
  return (
    <mesh>
      <points geometry={geometry} material={material} />
    </mesh>
  );
};
