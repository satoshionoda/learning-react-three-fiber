import { useGLTF } from "@react-three/drei";
import type { FC } from "react";

type Props = {} & Omit<JSX.IntrinsicElements["primitive"], "object">;
export const Target: FC<Props> = (props) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf"
  );
  return <primitive object={scene} {...props} />;
};
