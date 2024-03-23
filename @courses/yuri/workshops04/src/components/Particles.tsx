import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { makeDataTexture } from "@utils/makeDataTexture.ts";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import { useControls } from "leva";
import { useMemo } from "react";
import { FloatType, OrthographicCamera, Scene, ShaderMaterial, Vector3 } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import fragmentShader from "@/shaders/fragment.glsl";
import tempFragmentShader from "@/shaders/simFragment.glsl";
import tempVertexShader from "@/shaders/simVertex.glsl";
import vertexShader from "@/shaders/vertex.glsl";

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
    const pointGeometry = makePlaneGeometry(size);
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
