import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense } from "react";
import tunnel from "tunnel-rat";
import { Model } from "@/components/Model.tsx";

const MODELS: Record<string, string> = {
  Beech:
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf",
  Lime: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf",
  Spruce:
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf",
};

const status = tunnel();

export default function App() {
  const { model } = useControls({ model: { value: "Beech", options: Object.keys(MODELS) } });
  return (
    <>
      <header className={"absolute p-6    text-2xl"}>
        This is a {model.toLowerCase()} tree.
        <br />
        <status.Out />
      </header>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
        <hemisphereLight color="white" groundColor="blue" intensity={5} />
        <spotLight position={[50, 50, 10]} angle={0.15} penumbra={1} />
        <group position={[0, -10, 0]}>
          <Suspense fallback={<status.In>Loading ...</status.In>}>
            <Model position={[0, 0.25, 0]} url={MODELS[model]} />
          </Suspense>
          <ContactShadows scale={20} blur={10} far={20} />
        </group>
        <OrbitControls />
      </Canvas>
    </>
  );
}
