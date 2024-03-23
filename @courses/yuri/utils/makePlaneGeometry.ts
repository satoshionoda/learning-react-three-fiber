import { BufferAttribute, BufferGeometry } from "three";

export const makePlaneGeometry = (size: number): BufferGeometry => {
  const count = size * size;
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      positions[index * 3] = i / size;
      positions[index * 3 + 1] = j / size;
      positions[index * 3 + 2] = 0;
      uvs[index * 2] = i / size;
      uvs[index * 2 + 1] = j / size;
    }
  }
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  return geometry;
};
