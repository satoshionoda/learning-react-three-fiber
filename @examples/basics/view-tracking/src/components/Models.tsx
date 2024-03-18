import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import type { FC } from "react";
import type { Group, Mesh } from "three";

type PrimitiveProps = Omit<JSX.IntrinsicElements["primitive"], "object">;
type GroupProps = JSX.IntrinsicElements["group"];

function useHover() {
  const [hovered, hover] = useState(false);
  const onPointerOver = () => hover(true);
  const onPointerOut = () => hover(false);
  return { hovered, onPointerOver, onPointerOut };
}

export const Soda: FC<GroupProps> = (props) => {
  const ref = useRef<Group>(null!);
  const { hovered, onPointerOver, onPointerOut } = useHover();
  const { nodes, materials } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/soda-bottle/model.gltf"
  );
  const bobble0 = (nodes.Mesh_sodaBottle as Mesh).geometry;
  const bobble1 = (nodes.Mesh_sodaBottle_1 as Mesh).geometry;
  useFrame((state, delta) => (ref.current.rotation.y += delta));
  return (
    <group ref={ref} {...props} {...{ onPointerOut, onPointerOver }} dispose={null}>
      <mesh geometry={bobble0}>
        <meshStandardMaterial
          color={hovered ? "red" : "green"}
          roughness={0.33}
          metalness={0.8}
          envMapIntensity={2}
        />
      </mesh>
      <mesh geometry={bobble1} material={materials.red} material-envMapIntensity={0} />
    </group>
  );
};

export const Duck: FC<PrimitiveProps> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf"
  );
  return <primitive object={scene} {...props} />;
};

export const Candy: FC<PrimitiveProps> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/candy-bucket/model.gltf"
  );
  useFrame((state, delta) => (scene.rotation.z = scene.rotation.y += delta));
  return <primitive object={scene} {...props} />;
};

export const Flash: FC<PrimitiveProps> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lightning/model.gltf"
  );
  useFrame((state, delta) => (scene.rotation.y += delta));
  return <primitive object={scene} {...props} />;
};

export const Apple: FC<PrimitiveProps> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/apple-half/model.gltf"
  );
  useFrame((state, delta) => (scene.rotation.y += delta));
  return <primitive object={scene} {...props} />;
};

export const Target: FC<PrimitiveProps> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf"
  );
  useFrame((state, delta) => (scene.rotation.y += delta));
  return <primitive object={scene} {...props} />;
};
