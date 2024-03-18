import { useGLTF } from "@react-three/drei";
import type { FC } from "react";
import type { Mesh } from "three";

type Props = { name: string } & JSX.IntrinsicElements["mesh"];
export const Model: FC<Props> = ({ name, ...props }) => {
  const { nodes } = useGLTF("/assets/mesh/compressed.glb");
  const obj = nodes[name] as Mesh;
  return (
    <mesh
      geometry={obj.geometry}
      material={obj.material}
      material-emissive="red"
      material-roughness={1}
      {...props}
      dispose={null}
    />
  );
};
