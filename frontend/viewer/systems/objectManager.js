import { Raycaster, Vector2, Vector3 } from 'three'
import { materialSelected, materialStandard } from '../components/materials.js'

class ObjectManager {
  constructor(camera, scene, container) {
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    this.container = container
    this.camera = camera
    this.scene = scene
    this.object = null
    this.objectsArray = []
    this.intersects = []
    this.selected = []
    this.layers = []
    this.iotLayerIndex
    this.iotToggle = null
    this.transform = null
    this.container.addEventListener('dblclick', this.onMouseClick)
  }

  onMouseClick = event => {
    const canvasBounds = this.container.getBoundingClientRect()

    //mouse logic
    this.mouse.x =
      ((event.clientX - canvasBounds.left) /
        (canvasBounds.right - canvasBounds.left)) *
        2 -
      1
    this.mouse.y =
      -(
        (event.clientY - canvasBounds.top) /
        (canvasBounds.bottom - canvasBounds.top)
      ) *
        2 +
      1

    this.raycaster.setFromCamera(this.mouse, this.camera)
    this.selectionLogic()
  }

  //selects first visible object that is selectable, changes the color
  selectionLogic() {
    let object
    this.intersects = this.raycaster.intersectObjects(this.objectsArray)
    if (this.intersects.length != 0) {
      //first visible object
      object = this.intersects.find(o => o.object.visible == true).object

      //if selected before
      if (object.material.name == 'materialSelected') {
        const ids = this.selected.map(e => e.uuid).indexOf(object.uuid)
        this.selected.splice(ids, 1)
        this.updateMaterialToOriginal(object)

        //if not selected
      } else {
        this.selected.push(object)
        object.material = materialSelected
      }
    }

    //if nothing intersected
    if (this.intersects.length === 0) {
      this.selected.forEach(o => this.updateMaterialToOriginal(o))
      this.selected = []
    }

    if (this.transform) {
      this.getTransformObject(object)
    }
  }

  //select by layer name
  getByLayer(layerName) {
    const objectsOnLayer = []
    const layerIndex = this.getLayerIndex(layerName)

    this.objectsArray.forEach(o => {
      if (o.userData && o.userData.attributes.layerIndex == layerIndex) {
        objectsOnLayer.push(o)
      }
    })
    return objectsOnLayer
  }

  getLayerIndex(layerName) {
    let layerIndex
    this.layers.forEach((o, i) => {
      if (o === layerName) layerIndex = i
    })
    return layerIndex
  }

  getTransformObject(object) {
    //for now only one object can be selected in editMode
    if (this.selected.length > 1) {
      this.updateMaterialToOriginal(this.selected[0])
    }

    this.transform.detach()

    if (object) {
      this.selected = [object]
      object.geometry.computeBoundingBox()
      const center = object.geometry.boundingBox.getCenter(new Vector3())

      if (center.x !== 0 && center.y !== 0) {
        object.position.set(
          center.x,
          center.y,
          object.geometry.boundingBox.min.z
        )

        object.geometry
          .center()
          .translate(
            0,
            0,
            object.geometry.boundingBox.getSize(new Vector3()).z / 2
          )
          .computeBoundsTree()
      }
      this.transform.attach(object)

      console.log(this.selected)
    }
  }

  updateIotObjects() {
    this.iotLayerIndex = this.getLayerIndex('iot')
    this.objectsArray = this.objectsArray.filter(
      o => o.userData.attributes.layerIndex !== this.iotLayerIndex
    )
  }

  updateObjects(objects) {
    this.objectsArray = objects.children

    for (let o of this.objectsArray) {
      //if we are dealing with one of the results
      if (o.name.includes('Result')) {
        o.children.forEach(o => {
          this.checkMaterialColor(o)
        })
      } else {
        this.checkMaterialColor(o)
      }
    }
  }

  //check if color is not standard
  checkMaterialColor = o => {
    if (o.geometry && o.geometry.attributes.color) {
      this.updateMaterialToNonStandard(o)
    } else {
      o.material = materialStandard
    }
  }

  //save non standard material
  updateMaterialToNonStandard = o => {
    o.userData.attributes.legacyMaterial = o.material
    o.material.name = 'materialCustom'
    o.material.roughness = 0.8
    o.material.metalness = 0
    o.material.side = 2
  }

  //back to original material
  updateMaterialToOriginal = o => {
    if (o.userData.attributes && o.userData.attributes.legacyMaterial) {
      o.material = o.userData.attributes.legacyMaterial
    } else {
      o.material = materialStandard
    }
  }

  ////////////////////////////////////////////////////////////////Functions from UI////////////////////////////////////////
  //change this.selected to => this.selected.children (object)
  removeObjects = (objectsArray = this.selected) => {
    if (this.transform) {
      this.transform.detach()
    }
    const uuids = objectsArray.map(o => o.uuid)

    console.log(uuids)

    for (const id of uuids) {
      const object = this.scene.children[0].children.find(c => c.uuid === id)
      if (object.geometry) {
        object.geometry.dispose()
      }
      if (object.children) {
        object.children.forEach(c => c.geometry.dispose())
      }
      this.scene.children[0].remove(object)
      this.scene.remove(object)
      console.log(object)
    }
    this.selected = []
  }

  unselectAll = () => {
    this.selected = []
    this.objectsArray.forEach(o => {
      this.updateMaterialToOriginal(o)
    })
  }

  hideAll = () => {
    this.objectsArray.forEach(o => (o.visible = false))
  }

  showAll = () => {
    this.objectsArray.forEach(o => (o.visible = true))
  }

  hideSelected = () => {
    this.selected.forEach(o => (o.visible = false))
    this.selected = []
  }

  selectAll = () => {
    this.selected = []
    this.objectsArray.forEach(o => {
      o.material = materialSelected
      this.selected.push(o)
    })
  }
}
export { ObjectManager }
