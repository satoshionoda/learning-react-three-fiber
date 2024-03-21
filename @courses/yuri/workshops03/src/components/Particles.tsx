import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FloatType,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector3,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";
import fragmentShader from "@/shaders/fragment.glsl";
import tempFragmentShader from "@/shaders/simFragment.glsl";
import tempVertexShader from "@/shaders/simVertex.glsl";
import vertexShader from "@/shaders/vertex.glsl";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

const makeGeometry = (size: number) => {
  const count = size * size;
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      positions[index * 3] = i / size;
      positions[index * 3 + 1] = j / size;
      positions[index * 3 + 2] = 0;
      uvs[index * 2] = i / size;
      uvs[index * 2 + 1] = j / size;
    }
  }
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  return geometry;
};
const makeDataTexture = (size: number) => {
  const count = size * size;
  const data = new Float32Array(4 * count);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      data[4 * index] = lerp(-0.5, 0.5, j / (size - 1));
      data[4 * index + 1] = lerp(-0.5, 0.5, i / (size - 1));
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 1;
    }
  }
  const dataTexture = new DataTexture(data, size, size, RGBAFormat, FloatType);
  dataTexture.needsUpdate = true;
  return dataTexture;
};

const useInit = () => {
  const { size, pointSize, forceA, forceB, forceSpeed } = useControls({
    size: { value: 128, min: 8, max: 1024, step: 8 },
    pointSize: { value: 2, min: 0.01, max: 4, step: 0.01 },
    forceA: { value: 3, min: 0, max: 10, step: 0.01 },
    forceB: { value: 0.2, min: 0, max: 1, step: 0.01 },
    forceSpeed: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
  });

  // set up Three objects
  const { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial } = useMemo(() => {
    const positions = makeDataTexture(size);
    const pointGeometry = makeGeometry(size);
    const pointMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: positions },
        uTime: { value: 0 },
        uPointSize: { value: pointSize },
      },
    });
    //
    const tempMaterial = new ShaderMaterial({
      vertexShader: tempVertexShader,
      fragmentShader: tempFragmentShader,
      uniforms: {
        time: { value: 0 },
        uMouse: { value: new Vector3(0, 0, 0) },
        uCurrentPosition: { value: positions },
        uOriginalPosition: { value: positions },
        uForceA: { value: forceA },
        uForceB: { value: forceB },
        uForceSpeed: { value: forceSpeed },
      },
    });
    const tempScene = new Scene();
    const tempCamera = new OrthographicCamera(-1, 1, 1, -1, -2, 2);
    //
    return { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial };
  }, [size]);
  //
  //set up FBO
  let useTarget0 = true;
  const target0 = useFBO(size, size, { type: FloatType });
  const target1 = useFBO(size, size, { type: FloatType });
  useFrame(({ gl, clock }) => {
    const currentTarget = useTarget0 ? target1 : target0;
    const nextTarget = useTarget0 ? target0 : target1;
    gl.setRenderTarget(nextTarget);
    gl.render(tempScene, tempCamera);
    gl.setRenderTarget(null);

    pointMaterial.uniforms.uTexture.value = currentTarget.texture;
    pointMaterial.uniforms.uTime.value = clock.elapsedTime;
    pointMaterial.uniforms.uPointSize.value = pointSize;

    tempMaterial.uniforms.uCurrentPosition.value = nextTarget.texture;
    tempMaterial.uniforms.uForceA.value = forceA;
    tempMaterial.uniforms.uForceB.value = forceB;
    tempMaterial.uniforms.uForceSpeed.value = forceSpeed;
    useTarget0 = !useTarget0;
  });
  //
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    tempMaterial.uniforms.uMouse.value = e.point;
  };
  return { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove };
};
export const Particles = () => {
  const { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove } = useInit();

  return (
    <mesh>
      {createPortal(
        <mesh material={tempMaterial}>
          <planeGeometry args={[2, 2]} />
        </mesh>,
        tempScene
      )}
      {/*<mesh material={tempMaterial}>*/}
      {/*  <planeGeometry args={[1, 1]} />*/}
      {/*</mesh>*/}
      <points geometry={pointGeometry} material={pointMaterial} />
      <mesh onPointerMove={onPointerMove}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="red" visible={false} />
      </mesh>
    </mesh>
  );
};
