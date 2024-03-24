import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { getDataTextureFromImage } from "@utils/getDataTextureFromImage.ts";
import { makeDataTexture } from "@utils/makeDataTexture.ts";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import { useControls } from "leva";
import { Suspense, useMemo } from "react";
import usePromise from "react-promise-suspense";
import * as THREE from "three";
import { FloatType, OrthographicCamera, Scene, ShaderMaterial, Vector3 } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { FC } from "react";
import fragmentShader from "@/shaders/fragment.glsl";
import tempFragmentShader from "@/shaders/simFragment.glsl";
import tempVertexShader from "@/shaders/simVertex.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const useInit = () => {
  const { size, pointSize } = useControls({
    size: { value: 128, min: 8, max: 1024, step: 8 },
    pointSize: { value: 2, min: 0.01, max: 4, step: 0.01 },
  });
  const dataTexture = usePromise(getDataTextureFromImage, ["/logo.png", size]);
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
        uCurrentPosition: { value: dataTexture },
        uOriginalPosition: { value: dataTexture },
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
  const target0 = useFBO(size, size, {
    type: FloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });
  const target1 = useFBO(size, size, {
    type: FloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });
  useFrame(({ gl }) => {
    const currentTarget = useTarget0 ? target1 : target0;
    const nextTarget = useTarget0 ? target0 : target1;
    gl.setRenderTarget(nextTarget);
    gl.render(tempScene, tempCamera);
    gl.setRenderTarget(null);

    pointMaterial.uniforms.uTexture.value = currentTarget.texture;
    tempMaterial.uniforms.uCurrentPosition.value = nextTarget.texture;
    pointMaterial.uniforms.uPointSize.value = pointSize;

    useTarget0 = !useTarget0;
  });
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // tempMaterial.uniforms.uMouse.value = e.point;
  };
  return { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove };
};

type Props = {};
export const Particles: FC<Props> = () => {
  const { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove } = useInit();

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
};
