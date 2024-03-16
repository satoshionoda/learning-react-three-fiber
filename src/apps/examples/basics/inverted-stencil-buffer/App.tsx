import { Atom } from "@apps/examples/basics/inverted-stencil-buffer/components/Atom.tsx";
import { Box } from "@apps/examples/basics/inverted-stencil-buffer/components/Box.tsx";
import { Frame } from "@apps/examples/basics/inverted-stencil-buffer/components/Frame.tsx";
import { Bounds, Environment, Float, Mask, OrbitControls, PivotControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense } from "react";
import { mergeBufferGeometries } from "three-stdlib";

console.log(mergeBufferGeometries);

export default function App() {
  const { invert } = useControls({ invert: true });
  return (
    <Canvas shadows>
      <directionalLight position={[1, 2, 1.5]} intensity={0.5} castShadow />
      <hemisphereLight intensity={1.5} groundColor="red" />
      <Suspense fallback={null}>
        <PivotControls
          offset={[0, 0, 1]}
          activeAxes={[true, true, false]}
          disableRotations
          depthTest={false}
        >
          <Frame position={[0, 0, 1]} />
          <Mask id={1} position={[0, 0, 0.95]}>
            <circleGeometry args={[0.8, 64]} />
          </Mask>
        </PivotControls>
        <Bounds fit clip observe>
          <Float floatIntensity={4} rotationIntensity={0} speed={4}>
            <Atom invert={invert} scale={1.5} />
          </Float>
          <Box color="#EAC435" args={[1, 5, 1]} rotation-y={Math.PI / 4} position={[0, 0, -2]} />
          <Box color="#03CEA4" args={[2, 2, 2]} position={[-2, 0, -2]} />
          <Box color="#FB4D3D" args={[2, 2, 2]} position={[2, 0, -2]} />
        </Bounds>
        <Environment preset="city" />
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
