import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import type { FC } from "react";
import type { Group } from "three";

type Props = JSX.IntrinsicElements["group"];
const Rotate: FC<Props> = (props) => {
  const ref = useRef<Group>(null!);
  useFrame((state) => (ref.current.rotation.y = state.clock.elapsedTime));
  return <group ref={ref} {...props} />;
};
export default Rotate;
