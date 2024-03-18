import { useGLTF, useMask } from "@react-three/drei";
import type { FC } from "react";
import type { Mesh } from "three";

type Props = { invert: boolean } & JSX.IntrinsicElements["mesh"];

export const Atom: FC<Props> = ({ invert, ...props }) => {
  const stencil = useMask(1, invert);
  const { nodes } = useGLTF("/react-transformed.glb");
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.atom as Mesh).geometry}
      {...props}
      dispose={null}
    >
      <meshPhongMaterial color="#33BBFF" {...stencil} />
    </mesh>
  );
};
