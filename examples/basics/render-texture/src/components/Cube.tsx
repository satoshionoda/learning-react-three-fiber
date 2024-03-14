import { ComponentProps, useRef } from "react";
import { PerspectiveCamera, RenderTexture, Text } from "@react-three/drei";
import { suspend } from "suspend-react";
import { Dodecahedron } from "./Dodecachedron.tsx";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

// @ts-ignore
const inter = import("/Inter-Regular.woff");

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
          <Text font={(suspend(inter) as any).default} ref={textRef} fontSize={4} color="#555">
            hello
          </Text>
          <Dodecahedron />
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
};
