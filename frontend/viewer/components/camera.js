import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";

// class Camera {
//   constructor() {
//     this.camera = new PerspectiveCamera();
//   }
// }
function createCamera() {
  // const cameraOrtho = new OrthographicCamera(
  //   -600 * aspect,
  //   600 * aspect,
  //   600,
  //   -600,
  //   0.01,
  //   30000
  // );
  const camera = new PerspectiveCamera(35, 1, 0.1, 1000);

  camera.position.set(10, -10, 10);
  return camera;
}

function updateCamera(camera, controls, box, fitOffset = 1.6) {
  let size = box.getSize(new Vector3());
  let center = box.getCenter(new Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);
  const direction = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);

  controls.maxDistance = distance * 10;
  controls.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.position.copy(controls.target).sub(direction);

  controls.update();
}

export { createCamera, updateCamera };
