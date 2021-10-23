import { WebGLRenderer, PCFSoftShadowMap } from "three";

function createRenderer() {
  const renderer = new WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  return renderer;
}

export { createRenderer };
