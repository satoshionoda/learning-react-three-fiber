import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Model } from "./components/Model";
import Rotate from "@/components/Rotate.tsx";

// This sandbox shows how to progressively load an asset through nested suspense blocks
// 1. A generic fallback
// 2. Lesser resolution
// 3. High resolution

export default function App() {
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
        <directionalLight position={[10, 10, 0]} intensity={1.5} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 20, 0]} intensity={1.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.25} />
        <Rotate position-y={-0.5} scale={0.2}>
          <Suspense fallback={<Model url="/bust-lo-draco.glb" />}>
            <Model url="/bust-hi.glb" />
          </Suspense>
        </Rotate>
      </Canvas>
    </Suspense>
  );
}
