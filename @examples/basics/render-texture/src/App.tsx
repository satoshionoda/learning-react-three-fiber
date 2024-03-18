import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Cube } from "@/components/Cube.tsx";
import { Dodecahedron } from "@/components/Dodecachedron.tsx";

export default function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} />
      <Cube />
      <Dodecahedron position={[0, 1, 0]} scale={0.2} />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={1} opacity={0.75} />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={3} color="orange" />
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}
