import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import {
  getDataTextureFromImage,
  makeTextureFromImgElement,
} from "@utils/getDataTextureFromImage.ts";
import { loadImage } from "@utils/loadImage.ts";
import { makeDataTexture } from "@utils/makeDataTexture.ts";
import { makePlaneGeometry } from "@utils/makePlaneGeometry.ts";
import { useControls } from "leva";
import { Suspense, useMemo } from "react";
import usePromise from "react-promise-suspense";
import * as THREE from "three";
import {
  AdditiveBlending,
  FloatType,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector3,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { FC } from "react";
import fragmentShader from "@/shaders/fragment.glsl";
import tempFragmentShader from "@/shaders/simFragment.glsl";
import tempVertexShader from "@/shaders/simVertex.glsl";
import vertexShader from "@/shaders/vertex.glsl";

const useInit = (props: {
  size: number;
  pointSize: number;
  pointAlpha: number;
  progress: number;
}) => {
  const { size, pointSize, pointAlpha, progress } = props;
  const imgA = usePromise(loadImage, ["/logo.png"]);
  const imgB = usePromise(loadImage, ["/super.png"]);
  // const dataTextureA = usePromise(getDataTextureFromImage, ["/logo.png", size]);
  // const dataTextureB = usePromise(getDataTextureFromImage, ["/super.png", size]);
  // set up Three objects
  const { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial } = useMemo(() => {
    const dataTextureA = makeTextureFromImgElement(imgA, size);
    const dataTextureB = makeTextureFromImgElement(imgB, size);
    const positions = makeDataTexture(size);
    const pointGeometry = makePlaneGeometry(size);
    const pointMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: positions },
        uTime: { value: 0 },
        uPointSize: { value: pointSize },
        uPointAlpha: { value: pointAlpha },
      },
      blending: AdditiveBlending,
      transparent: true,
    });
    //
    const tempMaterial = new ShaderMaterial({
      vertexShader: tempVertexShader,
      fragmentShader: tempFragmentShader,
      uniforms: {
        time: { value: 0 },
        uMouse: { value: new Vector3(0, 0, 0) },
        uCurrentPosition: { value: dataTextureA },
        uOriginalPositionA: { value: dataTextureA },
        uOriginalPositionB: { value: dataTextureB },
        uProgress: { value: progress },
      },
    });
    const tempScene = new Scene();
    const tempCamera = new OrthographicCamera(-1, 1, 1, -1, -2, 2);
    //
    return { pointGeometry, pointMaterial, tempScene, tempCamera, tempMaterial };
  }, [size, imgA, imgB]);
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
    tempMaterial.uniforms.uProgress.value = progress;
    //
    pointMaterial.uniforms.uPointSize.value = pointSize;
    pointMaterial.uniforms.uPointAlpha.value = pointAlpha;

    useTarget0 = !useTarget0;
  });
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // tempMaterial.uniforms.uMouse.value = e.point;
  };
  return { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove };
};

type Props = { size: number; pointSize: number; pointAlpha: number; progress: number };
export const Particles: FC<Props> = (props) => {
  const { pointGeometry, pointMaterial, tempMaterial, tempScene, onPointerMove } = useInit(props);
  const FBO = useMemo(
    () => (
      <group>
        {createPortal(
          <mesh material={tempMaterial}>
            <planeGeometry args={[2, 2]} />
          </mesh>,
          tempScene
        )}
      </group>
    ),
    [tempMaterial, tempScene]
  );
  const Point = useMemo(
    () => <points geometry={pointGeometry} material={pointMaterial} />,
    [pointGeometry, pointMaterial]
  );

  return (
    <Suspense fallback={null}>
      <group>
        {FBO}
        {/*<mesh material={tempMaterial}>*/}
        {/*  <planeGeometry args={[1, 1]} />*/}
        {/*</mesh>*/}
        {Point}
        <mesh onPointerMove={onPointerMove}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="red" visible={false} />
        </mesh>
      </group>
    </Suspense>
  );
};
