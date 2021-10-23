//components
import { createCamera, updateCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { createLights, updateLights } from './components/lights.js'
import { createContext, updateContext } from './components/context.js'
import { createBoundingBox } from './components/box.js'

//systems
import { createRenderer } from './systems/renderer.js'
import {
  createOrbitControls,
  createTransformControls,
  removeTransformControls,
} from './systems/controls.js'
import { updateBVH } from './systems/bvh'
import { Resizer } from './systems/resizer.js'
import { Loop } from './systems/loop.js'
import { Navigation } from './systems/navigation.js'
import { ObjectManager } from './systems/objectManager.js'

import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'

class Viewer {
  constructor(container) {
    this.container = container
    this.renderer = createRenderer()
    this.scene = createScene()
    this.camera = createCamera()
    this.controls = createOrbitControls(this.camera, this.container)
    this.loop = new Loop(this.camera, this.scene, this.renderer, this.controls)
    this.resizer = new Resizer(this.container, this.camera, this.renderer)
    this.objectManager = new ObjectManager(
      this.camera,
      this.scene,
      this.container
    )
    this.container.append(this.renderer.domElement)
    this.object = null
    this.box = null
    this.navigation = null
    this.init()
  }

  //init animation loop
  init() {
    this.loop.animate()
  }

  //clean entire scene
  cleanScene() {
    while (this.scene.children.length > 0) {
      let child = this.scene.children[0].children

      //dispose all the geometries from memory
      child.forEach(o => {
        if (o.geometry) {
          o.geometry.dispose()
        } else if (o.children.geometry) {
          o.children.geometry.dispose()
        }
      })

      //remove all the scene children
      this.scene.remove(this.scene.children[0])
    }
  }

  //SHOULD UPDATE INSTEAD OF CLEANING
  cleanLightsAndContext() {
    const remove = []
    this.scene.children.forEach(o => {
      if (o.name == 'Light' || o.name == 'Context') {
        remove.push(o)
      }
    })
    remove.forEach(o => this.scene.remove(o))
  }

  //load new objects to the scene
  loadObjects(newObjects) {
    console.log(newObjects)
    this.object = updateBVH(newObjects)
    this.scene.add(this.object)
    this.box = createBoundingBox(this.object)
    createContext(this.scene, this.box)
    this.update()
  }

  //add objects to the existing scene
  addObjects(newObject) {
    //add as a result
    // newObject.name = `Result ${resultNumber}`

    this.scene.add(newObject)
    //this.object.children.push(newObject)

    this.object = newObject

    this.update()
    // resultNumber++
  }

  //update the settings in according to the scene objects
  update() {
    if (this.object) {
      this.cleanLightsAndContext()
      //manage objects
      this.objectManager.updateObjects(this.object)
      this.box = createBoundingBox(this.object)
      //fit camera to objects
      updateCamera(this.camera, this.controls, this.box)

      //base controls center on objects
      //this.navigation = new Navigation(this.camera, this.box, this.controls)

      //create context and lights !SHOULD BE UPDATED!
      createContext(this.scene, this.box)
      createLights(this.scene, this.box)

      //update size of AA
      //this.postprocessing.updateSize(this.box)
    }
  }

  updateObjectFromEditMode(object) {
    this.object.children.push(object)
    this.objectManager.objectsArray.push(object)
  }

  updateSceneFromEditMode() {
    this.scene.remove(this.transform)
    this.objectManager.transform = null
    this.editModeManager = null
    this.transform.dispose()
    this.update()
  }

  createEditModeManager() {
    this.objectManager.unselectAll()
    this.editModeManager = new EditModeManager(
      this.scene,
      this.container,
      this.camera
    )
    this.transform = createTransformControls(this.camera, this.container)
    this.objectManager.transform = this.transform
    this.transform.setSpace('world')
    this.scene.add(this.transform)
  }

  createIotManager() {
    const iotObjects = this.objectManager.getByLayer('iot')
    this.iotManager = new IotManager(
      this.scene,
      this.layersStructure,
      this.renderer.domElement,
      iotObjects,
      this.camera
    )
    this.objectManager.updateIotObjects()
    this.postprocessing.updateIotObjects(iotObjects)
  }

  updateLayersStructure(layersStructure) {
    this.objectManager.layers = layersStructure
    if (layersStructure.find(l => l.toLowerCase() == 'iot')) {
      this.iotToggle = true
      this.createIotManager()
    }
  }

  //OTHER///////////////////////////////////////////////////////////////////////////
  //zoom to scene
  zoomScene() {
    updateCamera(this.camera, this.controls, this.box)
  }

  //zoom selected object
  zoomSelected() {
    updateCamera(
      this.camera,
      this.controls,
      createBoundingBox(this.objectManager.selected)
    )
  }

  //adjust light position
  sunPath(hour) {
    updateLights(hour)
  }
}

export { Viewer }
