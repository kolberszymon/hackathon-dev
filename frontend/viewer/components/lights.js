import {
  DirectionalLight,
  AmbientLight,
  SpotLight,
  SpotLightHelper,
  CameraHelper,
  HemisphereLight,
  DirectionalLightHelper,
  Vector3,
  Sphere,
  MeshStandardMaterial,
  Mesh,
  SphereGeometry,
  Box3Helper,
} from "three";

import SunCalc from "suncalc";
// import * as dat from "dat.gui";

let year, month, day, hour, minutes, target, sphere;
year = 2021;
month = 6;
day = 22;
hour = 12;
minutes = 0;
let date = new Date(year, month, day, hour, minutes);
//console.log(date);

let coords = [55.67, 12.56];

//spherical cords
let sunPosition = SunCalc.getPosition(date, coords[0], coords[1]);

let a = sunPosition.azimuth;
let b = sunPosition.altitude;
let x = Math.sin(a) * Math.cos(b);
let y = Math.cos(a) * Math.cos(b);
let z = Math.sin(b);

//flip north with south
let sun = new Vector3(-x, -y, z);

// const gui = new dat.GUI({ name: "My GUI" });
//////////////////////////////////////////////////////////////////////////////////////////////////////

//create lights
const directionalLight = new DirectionalLight(0xffffff, 2.6);
const hemiLight = new HemisphereLight(0xffffff, 0x71748f, 0.8);
const ambientLight = new AmbientLight(0xffffff, 1.6);
// const spotLight1 = new SpotLight(0xffffff, 0);
// const spotLight2 = new SpotLight(0xffffff, 0);

function createLights(scene, box) {
  const center = new Vector3();
  box.getCenter(center);

  const size = new Vector3();
  box.getSize(size);

  //bounding sphere
  sphere = new Sphere();
  box.getBoundingSphere(sphere);

  const r = sphere.radius;
  // const r = 500;
  const geometry = new SphereGeometry(0.001, 1, 1);

  const material = new MeshStandardMaterial({
    opacity: 0,
    transparent: true,
  });

  target = new Mesh(geometry, material);
  target.position.set(center.x, center.y, center.z);
  scene.add(target);

  const scalar = 1.5 * r;

  //Light direction vector!
  let position = new Vector3(0.4, -0.35, 0.7);
  position = sun;

  position.normalize().multiplyScalar(scalar);
  const dirLightPosition = target.position.clone().add(position);

  //Other corner
  const positionOpo = new Vector3(-position.x, -position.y, position.z);
  const spotLightPosition = target.position.clone().add(positionOpo);

  //directional Light
  directionalLight.castShadow = true;
  directionalLight.position.set(
    dirLightPosition.x,
    dirLightPosition.y,
    dirLightPosition.z
  );

  directionalLight.name = "Light";
  directionalLight.target = target;
  directionalLight.shadow.radius = 5;
  directionalLight.shadow.camera.near = 0.5 * r;
  directionalLight.shadow.camera.far = 3 * r;
  directionalLight.shadow.camera.right = r;
  directionalLight.shadow.camera.left = -r;
  directionalLight.shadow.camera.top = r;
  directionalLight.shadow.camera.bottom = -r;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  //to fix shadow acne
  directionalLight.shadow.bias = -0.002;
  directionalLight.shadow.normalBias = 0.05;
  scene.add(directionalLight, ambientLight, hemiLight);

  //helper
  const helper = new CameraHelper(directionalLight.shadow.camera);
  helper.name = "Light";
  const helper2 = new DirectionalLightHelper(directionalLight, 5, 0x000000);
}

//clean the code
function updateLights(hourInput) {
  hour = hourInput;

  date = new Date(year, month, day, hour, minutes);
  sunPosition = SunCalc.getPosition(date, coords[0], coords[1]);

  //VECTOR.setFromSphericalCoords
  a = sunPosition.azimuth;
  b = sunPosition.altitude;
  x = Math.sin(a) * Math.cos(b);
  y = Math.cos(a) * Math.cos(b);
  z = Math.sin(b);
  //normalized sun
  sun = new Vector3(-x, -y, z);
  sun.multiplyScalar(sphere.radius);

  let dirLightPosition = target.position.clone().add(sun);

  directionalLight.position.set(
    dirLightPosition.x,
    dirLightPosition.y,
    dirLightPosition.z
  );
}

export { createLights, updateLights };
