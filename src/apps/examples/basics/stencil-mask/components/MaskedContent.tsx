import { useMask } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type FC, useRef, useState } from "react";
import type { Mesh } from "three";

type Props = { invert: boolean } & JSX.IntrinsicElements["group"];
export const MaskedContent: FC<Props> = ({ invert, ...props }) => {
  /* The useMask hook has to refer to the mask id defined below, the content
   * will then be stamped out.
   */
  const stencil = useMask(1, invert);
  const group = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);
  useFrame((state) => (group.current.rotation.y = state.clock.elapsedTime / 2));
  return (
    <group {...props}>
      <mesh position={[-0.75, 0, 0]} scale={1} ref={group}>
        <torusKnotGeometry args={[0.6, 0.2, 128, 64]} />
        <meshNormalMaterial {...stencil} />
      </mesh>
      <mesh
        position={[0.75, 0, 0]}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial {...stencil} color={hovered ? "orange" : "white"} />
      </mesh>
    </group>
  );
};
