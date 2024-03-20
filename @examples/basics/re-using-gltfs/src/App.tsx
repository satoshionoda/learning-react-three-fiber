import { BakeShadows, OrbitControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Shoe } from "@/components/Shoe.tsx";

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 150], fov: 40 }}>
      <Stage environment="city" intensity={0.6}>
        <Shoe color="tomato" position={[0, 0, 0]} />
        <Shoe color="orange" scale={-1} rotation={[0, 0.5, Math.PI]} position={[0, 0, -2]} />
      </Stage>
      <BakeShadows />
      <OrbitControls makeDefault autoRotate />
    </Canvas>
  );
}
