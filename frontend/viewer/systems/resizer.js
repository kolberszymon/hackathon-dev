class Resizer {
  constructor(container, camera, renderer, composer) {
    this.setSize(container, camera, renderer, composer)

    window.addEventListener('resize', () => {
      this.setSize(container, camera, renderer, composer)
    })
  }

  setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // composer.setSize(container.clientWidth, container.clientHeight)
    // composer.setPixelRatio(window.devicePixelRatio * 2)
  }
}

export { Resizer }
