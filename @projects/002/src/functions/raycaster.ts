import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const raycasterMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
);

export const setupRaycaster = (scene: THREE.Scene, camera: THREE.Camera) => {
  scene.add(raycasterMesh);
  window.addEventListener("mousemove", (e) => {
    onMouseMove(e, camera);
  });
};

const onMouseMove = (e: MouseEvent, mainCamera: THREE.Camera) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(x, y), mainCamera);
  const intersects = raycaster.intersectObjects([raycasterMesh]);
  if (intersects.length > 0) {
    // fboUniforms.uMouse.value = intersects[0].point;
  }
};
