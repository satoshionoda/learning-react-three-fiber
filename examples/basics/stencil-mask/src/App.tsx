import {
  ContactShadows,
  Environment,
  Float,
  Mask,
  MeshDistortMaterial,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense } from "react";
import { MaskedContent } from "@/components/MaskedContent.tsx";
import { Target } from "@/components/Target.tsx";

export default function App() {
  const { invert, colorWrite, depthWrite } = useControls({
    invert: false,
    colorWrite: true,
    depthWrite: false,
  });
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <hemisphereLight intensity={1} groundColor="red" />
      <Suspense fallback={null}>
        <Float floatIntensity={5} rotationIntensity={2} speed={10}>
          {/* Mask sets the shape of the area that is shown, and cuts everything else out.
           * This is valid only for meshes that use useMask with the same id, everything else
           * is not affected.
           */}
          <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite} position={[-1.1, 0, 0]}>
            <ringGeometry args={[0.5, 1, 64]} />
          </Mask>
        </Float>

        <TransformControls position={[1.1, 0, 0]}>
          {/* You can build compound-masks using the same id. Masks are otherwise the same as
           *  meshes, you can deform or transition them any way you like
           */}
          <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite}>
            <planeGeometry args={[2, 2, 128, 128]} />
            <MeshDistortMaterial distort={0.5} radius={1} speed={10} />
          </Mask>
        </TransformControls>

        <MaskedContent invert={invert} />
        <Target position={[0, -1, -3]} scale={1.5} />
        <ContactShadows frames={1} scale={10} position={[0, -1, 0]} blur={8} opacity={0.55} />
        <Environment preset="city" />
        <OrbitControls makeDefault />
      </Suspense>
    </Canvas>
  );
}
