import type { FC } from "react";

type Props = {} & JSX.IntrinsicElements["mesh"];
export const Frame: FC<Props> = (props) => (
  <mesh {...props}>
    <ringGeometry args={[0.75, 0.85, 64]} />
    <meshPhongMaterial color="black" />
  </mesh>
);
