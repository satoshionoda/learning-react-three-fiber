import { Canvas } from "@react-three/fiber";

type Props = {} & JSX.IntrinsicElements["mesh"];

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
    </Canvas>
  );
}
