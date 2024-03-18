import { Environment, PerspectiveCamera } from "@react-three/drei";
import type { FC } from "react";

type Props = { color?: string };
export const Common: FC<Props> = ({ color }) => (
  <>
    {color && <color attach="background" args={[color]} />}
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color="blue" />
    <Environment preset="dawn" />
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
  </>
);
