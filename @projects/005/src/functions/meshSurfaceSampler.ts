import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { Params } from "@/functions/ui.ts";

export const sampleSurface = (mesh: THREE.Mesh, count: number): THREE.BufferGeometry => {
  const sampler = new MeshSurfaceSampler(mesh).build();
  const pos = new Float32Array(count * 3);
  const norm = new Float32Array(count * 3);
  const colorFactor = new Float32Array(count);
  const size = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    const f = Math.random();
    const s = Math.random();
    sampler.sample(p, n);
    const shift = Math.random() * Params.pointShift * 2 - Params.pointShift;
    p.addScaledVector(n, shift);
    pos.set([p.x, p.y, p.z], i * 3);
    norm.set([n.x, n.y, n.z], i * 3);
    colorFactor.set([f], i);
    size.set([s], i);
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pointsGeometry.setAttribute("normal", new THREE.BufferAttribute(norm, 3));
  pointsGeometry.setAttribute("colorFactor", new THREE.BufferAttribute(colorFactor, 1));
  pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
  return pointsGeometry;
};
