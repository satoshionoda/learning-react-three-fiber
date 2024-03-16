import { Word } from "@apps/examples/basics/word-cloud/components/Word.tsx";
import { generate } from "random-words";
import { useMemo } from "react";
import * as THREE from "three";
import type { FC } from "react";

type Props = {
  count: number;
  radius: number;
};
export const Cloud: FC<Props> = ({ count = 4, radius = 20 }) => {
  const words = useMemo(() => {
    const temp: [THREE.Vector3, string][] = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push([
          new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)),
          generate() as string,
        ]);
    return temp;
  }, [count, radius]);
  return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />);
};
