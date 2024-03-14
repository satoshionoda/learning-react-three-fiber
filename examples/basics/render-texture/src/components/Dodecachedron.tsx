import { FC, useRef, useState } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type Props = {} & GroupProps;
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
