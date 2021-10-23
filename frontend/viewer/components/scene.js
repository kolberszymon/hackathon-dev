import { Color, Scene, Object3D, Vector3 } from "three";

function createScene() {
  const scene = new Scene();

  scene.background = new Color(0xededed);
  Object3D.DefaultUp = new Vector3(0, 0, 1);

  return scene;
}

export { createScene };
