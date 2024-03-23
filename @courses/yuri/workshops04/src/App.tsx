import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Particles } from "@/components/Particles.tsx";

export default function App() {
  return (
    <Canvas>
      <Particles />
      <PerspectiveCamera makeDefault position={[0, 0, 1.1]} />
      <OrbitControls />
    </Canvas>
  );
}
