import { Vector3, Sphere } from "three";

let that;
class Navigation {
  constructor(cameraObj, boxObj, controls) {
    this.controls = controls;
    this.controls.saveState();
    this.camera = cameraObj;
    this.box = boxObj;
    this.center = new Vector3();
    this.center = this.box.getCenter(new Vector3());
    this.size = this.box.getSize(new Vector3());
    this.sphere = this.box.getBoundingSphere(new Sphere());

    const { x, y, z } = cameraObj.position;
    this.homePosition = new Vector3(x, y, z);

    this.xMax = this.box.max.x;
    this.yMax = this.box.max.y;
    this.xMin = this.box.min.x;
    this.yMin = this.box.min.y;
    this.zMin = this.box.min.z;
    this.zBox = this.size.z;
    this.xBox = this.size.x;
    this.yBox = this.size.y;
    this.d = null;
    this.xBox > this.yBox ? (this.d = this.xBox) : (this.d = this.yBox);

    that = this;
  }
  cameraTop() {
    this.controls.reset();
    this.camera.position.set(that.center.x, that.center.y, 2 * this.d);
    this.camera.rotation.set(0);
  }
  cameraLeft() {
    this.controls.reset();
    this.camera.position.set(
      this.xMin - this.d,
      this.center.y,
      this.zMin + this.zBox / 2
    );
    this.camera.rotation.set(0);
  }
  cameraRight() {
    this.controls.reset();
    this.camera.position.set(
      this.xMax + this.d,
      this.center.y,
      this.zMin + this.zBox / 2
    );
    this.camera.rotation.set(0);
  }
  cameraFront() {
    this.controls.reset();
    this.camera.position.set(
      this.center.x,
      this.yMin - this.d,
      this.zMin + this.zBox / 2
    );
    this.camera.rotation.set(0);
  }
  cameraBack() {
    this.controls.reset();
    this.camera.position.set(
      this.center.x,
      this.yMax + this.d,
      this.zMin + this.zBox / 2
    );
    this.camera.rotation.set(0);
  }
  //Go back to home view / saved view
  cameraHome() {
    this.controls.reset();
    this.camera.position.set(
      this.homePosition.x,
      this.homePosition.y,
      this.homePosition.z
    );
  }
  //Save the view
  cameraSaveHome() {
    this.homePosition = that.camera.getWorldPosition(new Vector3());
  }
}
export { Navigation };
