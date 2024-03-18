import { PerspectiveCamera, RenderTexture, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { ComponentProps } from "react";
import type { Vector3 } from "three";
import { Dodecahedron } from "@/components/Dodecachedron.tsx";

export const Cube = () => {
  const textRef = useRef<ComponentProps<typeof Text>>(null!);
  useFrame((state) => {
    const position = textRef.current.position as never as Vector3;
    position.x = Math.sin(state.clock.elapsedTime) * 2;
  });
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 5]} />
          <color attach="background" args={["orange"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <Text font={"/Inter-Regular.woff"} ref={textRef} fontSize={4} color="#555">
            hello
          </Text>
          <Dodecahedron />
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
};
