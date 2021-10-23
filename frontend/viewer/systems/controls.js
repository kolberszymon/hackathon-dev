import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let orbit, controls
function createOrbitControls(camera, canvas) {
  orbit = new OrbitControls(camera, canvas)
  orbit.enableDamping = true
  orbit.dampingFactor = 0.1
  orbit.autoRotateSpeed = 1.5
  orbit.rotateSpeed = 0.7
  return orbit
}

function createTransformControls(camera, canvas) {
  controls = new TransformControls(camera, canvas)

  controls.addEventListener('dragging-changed', function(event) {
    orbit.enabled = !event.value
  })

  return controls
}

function removeTransformControls() {
  controls.dispose()
}

export { createOrbitControls, createTransformControls, removeTransformControls }
