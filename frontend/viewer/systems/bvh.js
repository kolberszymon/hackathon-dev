import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

import { BufferGeometry, Mesh } from "three";

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

function updateBVH(object) {
  object.children.forEach((o) => {
    o.geometry.computeBoundsTree();
  });
  return object;
}

export { updateBVH };
