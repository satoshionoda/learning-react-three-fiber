import { Center } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import { Object3D } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { FC } from "react";
import type { InstancedMesh } from "three";

const EDGE_LENGTH = 2;
const tempObject = new Object3D();

type Props = {
  resetLights: () => void;
} & JSX.IntrinsicElements["group"];
export const Cubes: FC<Props> = ({ resetLights }) => {
  const { roughness, count } = useControls({
    roughness: { value: 0.5, min: 0, max: 1 },
    count: { value: 5, min: 1, max: 25, step: 1 },
  });
  const [centerTop, setCenterTop] = useState(false);
  const edgeLength = useMemo(() => (EDGE_LENGTH / count) * 0.95, [count]);
  const meshRef = useRef<InstancedMesh>(null!);
  const resetPosition = () => {
    setCenterTop(false);
    setTimeout(() => {
      setCenterTop(true);
    }, 16);
  };

  useEffect(() => {
    let i = 0;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        for (let z = 0; z < count; z++) {
          const id = i++;
          let scale = Math.random();
          if (scale < 0.7) scale = 0;
          const e = EDGE_LENGTH / count;
          tempObject.position.set(x * e - EDGE_LENGTH / 2, y * e, z * e - EDGE_LENGTH / 2);
          tempObject.scale.set(scale, scale, scale);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(id, tempObject.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    resetLights();
    resetPosition();
  }, [count]);

  return (
    <Center top={centerTop}>
      <instancedMesh
        castShadow
        receiveShadow
        ref={meshRef}
        args={[undefined, undefined, count * count * count]}
        geometry={new RoundedBoxGeometry(edgeLength, edgeLength, edgeLength, 3, 0.04 / count)}
      >
        <meshStandardMaterial metalness={1} roughness={roughness} />
      </instancedMesh>
    </Center>
  );
};
