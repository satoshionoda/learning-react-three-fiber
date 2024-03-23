import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
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
} from "three";
import fragmentShader from "@/shaders/fragment.glsl";
import tempFragmentShader from "@/shaders/simFragment.glsl";
import tempVertexShader from "@/shaders/simVertex.glsl";
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
const makeShaderMaterial = (size: number, vert: string, frag: string) => {
  const material = new ShaderMaterial();
  material.vertexShader = vert;
  material.fragmentShader = frag;
  material.uniforms = {
    time: { value: 0 },
    uTexture: { value: makeDataTexture(size) },
  };
  return material;
};

const useInit = () => {
  const size = 32;
  const { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial } = useMemo(() => {
    const pointGeometry = makePlaneGeometry(size);
    const pointMaterial = makeShaderMaterial(size, vertexShader, fragmentShader);
    //
    const tempMaterial = makeShaderMaterial(size, tempVertexShader, tempFragmentShader);
    const tempScene = new Scene();
    const tempCamera = new OrthographicCamera(-1, 1, 1, -1, -2, 2);
    //
    return { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial };
  }, []);
  //
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
    tempMaterial.uniforms.uTexture.value = nextTarget.texture;
    useTarget0 = !useTarget0;
  });
  return { pointGeometry, pointMaterial, tempMaterial, tempScene };
};
export const Particles = () => {
  const { pointGeometry, pointMaterial, tempMaterial, tempScene } = useInit();
  return (
    <mesh>
      {createPortal(
        <mesh material={tempMaterial}>
          <planeGeometry args={[2, 2]} />
        </mesh>,
        tempScene
      )}
      {/*<mesh material={tempMaterial}>*/}
      {/*  <planeGeometry args={[2, 2]} />*/}
      {/*</mesh>*/}
      <points geometry={pointGeometry} material={pointMaterial} />
    </mesh>
  );
};
