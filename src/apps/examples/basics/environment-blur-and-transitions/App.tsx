import { Env } from "@apps/examples/basics/environment-blur-and-transitions/components/Env.tsx";
import { Sphere } from "@apps/examples/basics/environment-blur-and-transitions/components/Sphere.tsx";
import { AccumulativeShadows, OrbitControls, RandomizedLight } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <group position={[0, -0.65, 0]}>
        <Sphere />
        <AccumulativeShadows
          temporal
          frames={200}
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
