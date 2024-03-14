import { Canvas } from "@react-three/fiber";
import { AccumulativeShadows, OrbitControls, RandomizedLight } from "@react-three/drei";
import { Env } from "@/components/Env.tsx";
import { Cubes } from "@/components/Cubes.tsx";
import { useState } from "react";

const LIGHT_FRAMES = 60;
export default function App() {
  const [lightFrames, setLightFrames] = useState(LIGHT_FRAMES);
  const resetLights = () => {
    setLightFrames(0);
    setTimeout(() => {
      setLightFrames(LIGHT_FRAMES);
    }, 16);
  };
  return (
    <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <group position-y={-0.8}>
        <Cubes {...{ resetLights }} />

        <AccumulativeShadows
          temporal
          frames={lightFrames}
          color="gray"
          colorBlend={0.5}
          opacity={1}
          scale={10}
          alphaTest={0.85}
        >
          <RandomizedLight amount={10} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <Env />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.1}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
