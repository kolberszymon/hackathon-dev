class Loop {
  constructor(camera, scene, renderer, controls, composer = null) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.controls = controls
    this.composer = composer
    this.timestamp = null
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    // this.composer.render()
  }
}

export { Loop }
