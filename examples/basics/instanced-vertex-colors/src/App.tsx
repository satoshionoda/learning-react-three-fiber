import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";
import { Boxes } from "@/components/Boxes.tsx";

export const App = () => (
  <Canvas gl={{ antialias: false }} camera={{ position: [0, 0, 15], near: 5, far: 20 }}>
    <color attach="background" args={["#f0f0f0"]} />
    <Boxes />
    {/*
    disableNormalPass は enableNormalPass に変わってデフォルトで使われなくなった
    https://github.com/pmndrs/react-postprocessing/commit/fa0dd4427f83e5997fe773851f6c60bea7cb3bcc
     */}
    <EffectComposer>
      <N8AO aoRadius={0.5} intensity={1} />
      <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
    </EffectComposer>
  </Canvas>
);

export default App;
