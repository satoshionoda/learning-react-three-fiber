import { Center, Environment, useGLTF } from "@react-three/drei";
import type { FC } from "react";
import type { Matrix4 } from "three";
import type { Mesh } from "three";

type Props = {
  background?: string;
  matrix: Matrix4;
} & JSX.IntrinsicElements["group"];
export const Scene: FC<Props> = ({ background = "white", matrix, children, ...props }) => {
  const { nodes, materials } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bricks/model.gltf"
  );
  return (
    <>
      <color attach="background" args={[background]} />
      <ambientLight />
      <directionalLight
        position={[10, 10, -15]}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={1024}
      />
      <Environment preset="city" />
      <group
        matrixAutoUpdate={false}
        // Why onUpdate and not just matrix={matrix} ?
        // This is an implementation detail, overwriting (most) transform objects isn't possible in Threejs
        // because they are defined read-only. Therefore Fiber will always call .copy() if you pass
        // an object, for instance matrix={new THREE.Matrix4()} or position={new THREE.Vector3()}
        // In this rare case we do not want it to copy the matrix, but refer to it.
        onUpdate={(self) => (self.matrix = matrix)}
        {...props}
      >
        <Center>
          <mesh
            castShadow
            geometry={(nodes.bricks as Mesh).geometry}
            material={materials["Stone.014"]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="goldenrod" roughness={0} metalness={1} />
          </mesh>
        </Center>
        {children}
      </group>
    </>
  );
};
