import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { loadImage } from "@utils/loadImage.ts";
import { useEffect, useState } from "react";
import { Particles } from "@/components/Particles.tsx";
export default function App() {
  const [img, setImg] = useState<HTMLImageElement>();
  useEffect(() => {
    loadImage("logo.png").then((r) => setImg(r));
  }, [setImg]);
  return (
    <Canvas>
      <Particles />
      <PerspectiveCamera makeDefault position={[0, 0, 1.1]} />
      <OrbitControls />
    </Canvas>
  );
}
