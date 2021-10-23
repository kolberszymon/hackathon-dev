import {
  MeshStandardMaterial,
  LineBasicMaterial,
  MeshPhongMaterial,
} from "three";

const materialStandard = new MeshStandardMaterial({
  name: "materialStandard",
  color: 0xebebeb,
  side: 2,
  flatShading: true,
  //wireframe: true,
});

const materialDraw = new MeshStandardMaterial({
  color: 0x60a5fa,
  side: 2,
  flatShading: true,
  transparent: true,
  opacity: 0.4,
});

const materialSelected = new MeshStandardMaterial({
  name: "materialSelected",
  color: 0x34d399,
  opacity: 0.9,
  transparent: true,
  side: 2,
  flatShading: true,
});

const materialIot = new MeshStandardMaterial({
  name: "materialIot",
  color: 0xff3d41,
  opacity: 0.3,
  transparent: true,
  emissiveIntensity: 0,
  emissive: 0xebebeb,
  side: 2,
  wireframe: false,
});

const materialLine = new LineBasicMaterial({
  color: 0x2563eb,
  linewidth: 1,
});
const materialLineDone = new LineBasicMaterial({
  color: 0x000000,
  linewidth: 1,
});

export {
  materialStandard,
  materialSelected,
  materialIot,
  materialDraw,
  materialLine,
  materialLineDone,
};
