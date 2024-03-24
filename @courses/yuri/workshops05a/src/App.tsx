import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { loadImage } from "@utils/loadImage.ts";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import { Particles } from "@/components/Particles.tsx";
export default function App() {
  const { size, pointSize, pointAlpha, progress } = useControls({
    size: { value: 256, min: 8, max: 1024, step: 8 },
    pointSize: { value: 2, min: 0.01, max: 4, step: 0.01 },
    pointAlpha: { value: 0.3, min: 0.05, max: 1, step: 0.01 },
    progress: { value: 1, min: 0, max: 1, step: 0.01 },
  });
  return (
    <Canvas>
      <Particles {...{ size, pointSize, pointAlpha, progress }} />
      <PerspectiveCamera makeDefault position={[0, 0, 1.1]} />
      <OrbitControls />
    </Canvas>
  );
}
