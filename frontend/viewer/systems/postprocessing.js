import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Vector2, Vector3 } from "three";

class Postprocessing {
  constructor(container, scene, camera, renderer) {
    this.container = container;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.pixelRatio = this.renderer.getPixelRatio();
    this.outlineObjects = null;
    this.box = null;
    this.objects = null;
    this.composer = new EffectComposer(this.renderer);

    //render Passes
    this.renderPass = new RenderPass(this.scene, this.camera);

    this.fxaaPass = new ShaderPass(FXAAShader);
    this.fxaaPass.material.uniforms["resolution"].value.x =
      1 / (this.container.offsetWidth * this.pixelRatio);
    this.fxaaPass.material.uniforms["resolution"].value.y =
      1 / (this.container.offsetHeight * this.pixelRatio);

    this.outlinePass = new OutlinePass(
      new Vector2(
        this.container.clientWidth * 2,
        this.container.clientHeight * 2
      ),
      this.scene,
      this.camera
    );
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeStrength = 5;
    this.outlinePass.edgeThickness = 3;

    //saoPass
    this.saoPass = new SAOPass(this.scene, this.camera, false, false);
    this.saoPass.params.saoIntensity = 0.03;
    this.saoPass.params.saoBias = 0.5;
    this.saoPass.params.saoScale = 900;
    this.saoPass.params.kernelRadius = 10;

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.fxaaPass);
    this.composer.addPass(this.saoPass);
    this.saoPass.enabled = false;
    this.fxaaPass.enabled = false;
    this.composer.addPass(this.outlinePass);
  }

  //update IoT objects
  updateIotObjects(objects) {
    if (objects) {
      this.outlineObjects = objects;
      this.outlinePass.selectedObjects = objects;
      this.outlinePass.visibleEdgeColor.set("#ff0000");
      console.log(this.outlinePass);
    }
  }

  updateSize(box) {
    const size = box.getSize(new Vector3());
    const bigSize = size.y > size.x ? size.y : size.x;
    this.saoPass.params.saoScale = 10 * bigSize;
    this.saoPass.params.kernelRadius = 2 * bigSize;
  }

  //AO toggle
  toggleAmbientOclussion() {
    this.saoPass.enabled = !this.saoPass.enabled;
  }

  //AA toggle
  toggleAntiAliasing() {
    this.fxaaPass.enabled = !this.fxaaPass.enabled;
  }
}

export { Postprocessing };
