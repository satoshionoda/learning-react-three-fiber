import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { FC } from "react";
import type { Mesh } from "three";

type Props = {} & JSX.IntrinsicElements["group"];
export const Dodecahedron: FC<Props> = (props) => {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => (meshRef.current.rotation.x += 0.01));
  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <dodecahedronGeometry args={[0.75]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "#5de4c7"} />
      </mesh>
    </group>
  );
};
