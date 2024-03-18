import { generate } from "random-words";
import { useMemo } from "react";
import { Spherical, Vector3 } from "three";
import type { FC } from "react";
import { Word } from "@/components/Word.tsx";

type Props = {
  count: number;
  radius: number;
};
export const Cloud: FC<Props> = ({ count = 4, radius = 20 }) => {
  const words = useMemo(() => {
    const temp: [Vector3, string][] = [];
    const spherical = new Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push([
          new Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)),
          generate() as string,
        ]);
    return temp;
  }, [count, radius]);
  return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />);
};
