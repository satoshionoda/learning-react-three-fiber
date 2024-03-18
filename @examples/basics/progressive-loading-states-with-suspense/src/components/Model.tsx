import { useGLTF } from "@react-three/drei";
import React from "react";
import type { FC } from "react";

type Props = { url: string } & Omit<JSX.IntrinsicElements["primitive"], "object">;
export const Model: FC<Props> = ({ url, ...props }) => {
  // useGLTF suspends the component, it literally stops processing
  const { scene } = useGLTF(url);
  // By the time we're here the model is gueranteed to be available
  return <primitive object={scene} {...props} />;
};
