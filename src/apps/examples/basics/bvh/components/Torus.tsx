import { type FC, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { MeshBVHHelper } from "three-mesh-bvh";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type Props = {} & JSX.IntrinsicElements["mesh"];

export const Torus: FC<Props> = (props) => {
  const mesh = useRef<Mesh>(null!);
  const sphere = useRef<Mesh>(null!);
  useHelper(mesh, MeshBVHHelper);
  useFrame((state, delta) => (mesh.current.rotation.x = mesh.current.rotation.y += delta));
  return (
    <mesh
      ref={mesh}
      {...props}
      onPointerMove={(e) => {
        sphere.current.position.copy(mesh.current.worldToLocal(e.point));
      }}
      onPointerOver={() => {
        sphere.current.visible = true;
      }}
      onPointerOut={() => {
        sphere.current.visible = false;
      }}
    >
      <torusKnotGeometry args={[1, 0.4, 200, 50]} />
      <meshNormalMaterial />
      <mesh raycast={() => null} ref={sphere} visible={false}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="orange" toneMapped={false} />
      </mesh>
    </mesh>
  );
};
