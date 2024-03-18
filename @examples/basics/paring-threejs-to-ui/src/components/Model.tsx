import { useGLTF } from "@react-three/drei";
import { useDeferredValue } from "react";
import type { FC } from "react";

type Props = { url: string } & Omit<JSX.IntrinsicElements["primitive"], "object">;

export const Model: FC<Props> = ({ url, ...props }) => {
  const deferred = useDeferredValue(url);
  const { object, ...rest } = props;
  const { scene } = useGLTF(deferred);
  return <primitive object={scene} {...rest} />;
};
