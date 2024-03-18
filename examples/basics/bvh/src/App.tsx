import { Bvh, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Rays } from "@/components/Rays.tsx";
import { Torus } from "@/components/Torus.tsx";

export default function App() {
  const { enabled } = useControls({ enabled: true });
  return (
    <Canvas camera-position-z={40} camera-far={100}>
      <color attach="background" args={["#202025"]} />
      <Perf position="bottom-right" style={{ margin: 10 }} />
      {/** Anything that Bvh wraps is getting three-mesh-bvh's acceleratedRaycast.
           Click on "enabled" to see what normal raycast performance in threejs looks like. */}
      <Bvh firstHitOnly enabled={enabled}>
        <Rays>
          <Torus />
        </Rays>
      </Bvh>
      <OrbitControls />
    </Canvas>
  );
}
