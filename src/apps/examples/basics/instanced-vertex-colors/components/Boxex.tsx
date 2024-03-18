import { type ThreeEvent, useFrame } from "@react-three/fiber";
import niceColors from "nice-color-palettes";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { InstancedMesh } from "three";

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const data = Array.from({ length: 1000 }, () => ({
  color: niceColors[17][Math.floor(Math.random() * 5)],
  scale: 1,
}));
export const Boxes = () => {
  const [hovered, setHovered] = useState<number | undefined>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000).fill(0).flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    []
  );
  const meshRef = useRef<InstancedMesh>(null!);
  const prevRef = useRef<number>();
  useEffect(() => {
    prevRef.current = hovered;
  }, [hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4);
    meshRef.current.rotation.y = Math.sin(time / 2);
    let i = 0;
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++;
          //
          tempObject.position.set(5 - x, 5 - y, 5 - z);
          tempObject.rotation.y =
            Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time);
          tempObject.rotation.z = tempObject.rotation.y * 2;
          //
          // オリジナルでは hovered !== prevRef.Current となっており、常にtrueになる
          // if (hovered !== prevRef.Current) {
          if (id === hovered) {
            tempColor.setRGB(10, 10, 10);
          } else {
            tempColor.set(data[id].color);
          }
          tempColor.toArray(colorArray, id * 3);
          meshRef.current.geometry.attributes.color.needsUpdate = true;
          // }
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(id, tempObject.matrix);
        }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(e.instanceId);
  };
  const onPointerOut = () => {
    setHovered(undefined);
  };
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, 1000]}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    >
      <boxGeometry args={[0.6, 0.6, 0.6]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </boxGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
};
