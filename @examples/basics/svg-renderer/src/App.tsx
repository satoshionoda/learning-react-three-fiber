import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { SVGRenderer } from "three-stdlib";
import type { Mesh } from "three";

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 35] }}
      gl={(canvas) => {
        const gl = new SVGRenderer();
        console.log(canvas);
        const parent = (canvas as HTMLCanvasElement).parentNode!;
        parent.removeChild(canvas as HTMLCanvasElement);
        parent.appendChild(gl.domElement);
        return gl;
      }}
    >
      <TorusKnot />
    </Canvas>
  );
}

function TorusKnot() {
  const ref = useRef<Mesh>(null!);
  const [hovered, set] = useState(false);
  useFrame((state, delta) => {
    ref.current.rotation.x = ref.current.rotation.y += delta / 2;
  });
  return (
    <mesh ref={ref} onPointerOver={() => set(true)} onPointerOut={() => set(false)}>
      <torusKnotGeometry args={[10, 3, 128, 32]} />
      <meshBasicMaterial color={hovered ? "lightblue" : "hotpink"} />
    </mesh>
  );
}
