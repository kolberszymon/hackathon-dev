import {
  GridHelper,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  Vector3,
  ShadowMaterial,
  GreaterStencilFunc,
} from "three";

let grid, plane, dim, updatedDim;
let size = new Vector3();
let updatedSize = new Vector3();
let center = new Vector3();
const material = new ShadowMaterial({
  opacity: 0.2,
});

function createContext(scene, box) {
  box.getCenter(center);
  box.getSize(size);

  size.x > size.y ? (dim = size.x) : (dim = size.y);

  //grid helper
  const light = 0xebebeb;
  const dark = 0xebebeb;
  const fitOffset = 3;
  const fitOffsetGrid = 1.4;
  grid = new GridHelper(fitOffsetGrid * dim, 30, dark, light);
  grid.rotateX(Math.PI / 2);
  grid.position.set(center.x, center.y, box.min.z - 0.1);
  grid.name = "Context";

  //plane
  const planeGeometry = new PlaneGeometry(fitOffset * dim, fitOffset * dim);
  plane = new Mesh(planeGeometry, material);
  plane.receiveShadow = true;
  plane.name = "Context";
  plane.position.set(center.x, center.y, box.min.z - 0.1);

  //export to Viewer
  scene.add(plane, grid);
}

function updateContext(box) {
  box.getCenter(center);
  box.getSize(updatedSize);

  updatedSize.x > updatedSize.y
    ? (updatedDim = updatedSize.x)
    : (updatedDim = updatedSize.y);

  const scale = dim / updatedDim;

  grid.position.set(center.x, center.y, grid.position.z);
  grid.scale.set(scale, scale, 1);
  plane.position.set(center.x, center.y, grid.position.z);
  plane.scale.set(scale, scale, 1);

  // updateMatrix(grid);
  updateMatrix(plane);

  size = updatedSize;
  dim = updatedDim;
}
function updateMatrix(object) {
  // object.updateMatrix();
  object.geometry.applyMatrix4(object.matrix);
  // object.position.set(0, 0, 0);
  // object.updateMatrix();
  // object.rotation.set(0, 0, 0);
  object.scale.set(1, 1, 1);
}

export { createContext, updateContext };
