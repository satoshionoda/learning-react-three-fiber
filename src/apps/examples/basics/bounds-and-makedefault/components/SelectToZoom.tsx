// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
import { useBounds } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { FC } from "react";

type Props = JSX.IntrinsicElements["group"];
export const SelectToZoom: FC<Props> = ({ children }) => {
  const api = useBounds();
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta <= 2) {
      api.refresh(e.object).fit();
    }
  };
  const onPointMissed = (e: MouseEvent) => {
    if (e.button === 0) {
      api.refresh().fit();
    }
  };
  return (
    <group onClick={onClick} onPointerMissed={onPointMissed}>
      {children}
    </group>
  );
};
