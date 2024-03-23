import { DataTexture, FloatType, RGBAFormat } from "three";
import { lerp } from "./lerp";

export const makeDataTexture = (size: number) => {
  const count = size * size;
  const data = new Float32Array(4 * count);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      data[4 * index] = lerp(-0.5, 0.5, j / (size - 1));
      data[4 * index + 1] = lerp(-0.5, 0.5, i / (size - 1));
      data[4 * index + 2] = 0;
      data[4 * index + 3] = 1;
    }
  }
  const dataTexture = new DataTexture(data, size, size, RGBAFormat, FloatType);
  dataTexture.needsUpdate = true;
  return dataTexture;
};
