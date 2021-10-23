import { OBJLoader } from "../../node_modules/three/examples/jsm/loaders/OBJLoader.js";

function loadObj(viewer) {
  const loader = new OBJLoader();

  loader.load(
    "../public/models/homechain_02.obj",

    function (object) {
      viewer.addObjects(object);
      return object;
    },

    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log(error);
    }
  );
}

export { loadObj };
