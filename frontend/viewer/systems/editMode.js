import {
  BufferGeometry,
  EllipseCurve,
  LineLoop,
  Vector2,
  Vector3,
  Raycaster,
  Plane,
  Line,
  Mesh,
  SphereGeometry,
  Color,
  MeshStandardMaterial,
  PlaneHelper,
  Object3D,
} from 'three'
import { setObjectToRhino } from '../../../../../frontend/src/composables/useRhino'
import Tween from '@tweenjs/tween.js'
import {
  materialDraw,
  materialLine,
  materialLineDone,
  materialStandard,
} from '../components/materials'

class EditModeManager {
  constructor(scene, container, camera) {
    this.raycaster = new Raycaster()
    this.container = container
    this.scene = scene
    this.camera = camera

    //container
    this.container = container
    this.canvasBounds = this.container.getBoundingClientRect()

    //mouse mapping
    this.mouse = new Vector2()
    //array with all the points nicely formated
    this.intersects = []
    this.intersect = null
    //array for buffer attribute
    this.positions = []
    //reference plane to draw on
    this.referencePlane = null
    //limit of point per one polyline
    this.maxPoints = 100
    //click count
    this.clickCount = 0
    //allows to draw
    this.draw = false
    //type of the shape
    this.type = null

    //current x,y,z
    this.x = null
    this.y = null
    this.z = null

    this.currentObject = null
    this.currentUpdateFunction = null
    this.currentClickFunction = null

    //circle variables
    this.circleShape = null

    //box variables
    this.faces = null

    this.lineMaterial = materialLine
    this.materialLineDone = materialLineDone
    this.materialDraw = materialDraw
    this.materialStandard = materialStandard
  }

  //first function, called from frontend
  drawShape(type) {
    //allow to draw
    this.draw = true
    //chose the type
    this.type = type
    //reset intersections
    this.intersects = []
    //reset click ocunter
    this.clickCount = 0
    //reset current object
    this.currentObject = null
    //reset points
    this.positions = []
    //reference plane
    this.referencePlane = new Plane(new Vector3(0, 0, 1))
    //remove drag controls while drawing
    //this.transform.dispose();

    //add event listeners
    this.container.addEventListener('click', this.onMouseClick, false)
    this.container.addEventListener('mousemove', this.onMouseMove, false)

    switch (type) {
      case 'line':
        this.type = 'line'
        this.currentUpdateFunction = this.updateLine
        this.currentClickFunction = this.addPointToLine
        break
      case 'circle':
        this.type = 'circle'
        this.currentUpdateFunction = this.updateCircle
        this.currentClickFunction = this.addPointToCircle
        break
      case 'rectangle':
        this.type = 'rectangle'
        this.currentUpdateFunction = this.updateRectangle
        this.currentClickFunction = this.addPointToRectangle
        break
      case 'box':
        this.type = 'box'
        this.currentUpdateFunction = this.updateBox
        this.currentClickFunction = this.addPointToBox
        break
      case 'sphere':
        this.type = 'sphere'
        this.currentUpdateFunction = this.updateSphere
        this.currentClickFunction = this.addPointToSphere
        break
    }
  }

  //HANLDE CLICK/////////////////////////////////////////////////////////////////////////////////
  onMouseClick = event => {
    this.clickCount++
    if (this.draw && this.clickCount > 0) {
      this.intersects.push(this.intersect)
      this.currentClickFunction()
    }
  }

  //HANLDE MOVE/////////////////////////////////////////////////////////////////////////////////
  onMouseMove = event => {
    if (this.draw && this.clickCount > 0) {
      this.mouse.x =
        ((event.clientX - this.canvasBounds.left) /
          (this.canvasBounds.right - this.canvasBounds.left)) *
          2 -
        1
      this.mouse.y =
        -(
          (event.clientY - this.canvasBounds.top) /
          (this.canvasBounds.bottom - this.canvasBounds.top)
        ) *
          2 +
        1
      this.mouse.z = 0

      this.intersect = new Vector3()

      this.raycaster.setFromCamera(this.mouse, this.camera)
      this.raycaster.ray.intersectPlane(this.referencePlane, this.intersect)

      const { x, y, z } = this.intersect
      this.x = x
      this.y = y
      this.z = z

      this.currentUpdateFunction()
    }
  }

  //Handle polyline//////////////////////////////////////////////////////////////////////////////////////////
  addPointToLine() {
    if (this.clickCount == 1) {
      window.addEventListener(
        'keypress',
        e => {
          if (e.key === 'Enter') {
            this.draw = !this.draw
            this.resetAfterDrawing()
            //remove last point
            this.intersects.pop()
            this.currentObject.geometry.setFromPoints(this.intersects)
          }
        },
        { once: true }
      )

      //Line
      const geometry = new BufferGeometry()
      this.currentObject = new Line(geometry, this.lineMaterial)
      this.scene.add(this.currentObject)
    }

    //add point on click
    this.currentObject.geometry.setDrawRange(0, this.intersects.length + 1)
  }

  updateLine() {
    this.intersects[this.intersects.length - 1] = this.intersect
    if (this.intersects.length > 0) {
      this.currentObject.geometry.setFromPoints(this.intersects)
    }
  }

  //Handle circle//////////////////////////////////////////////////////////////////////////////////////////
  addPointToCircle() {
    if (this.clickCount === 2) {
      //initial shape
      this.circleShape = new EllipseCurve(
        this.x,
        this.y,
        1,
        1,
        0,
        2 * Math.PI,
        false,
        0
      )

      const geometry = new BufferGeometry()
      this.currentObject = new Line(geometry, this.lineMaterial)
      this.scene.add(this.currentObject)
    }

    if (this.clickCount === 3) {
      this.resetAfterDrawing()
      this.circleShape = null
    }
  }

  //update radius
  updateCircle() {
    if (this.currentObject) {
      const circleRadius = this.intersects[1].distanceTo(this.intersect)
      this.circleShape.xRadius = this.circleShape.yRadius = circleRadius
      this.positions = this.circleShape.getPoints(50)
      this.currentObject.geometry.setFromPoints(this.positions)
    }
  }

  //Handle rectangle//////////////////////////////////////////////////////////////////////////////////////////
  addPointToRectangle() {
    if (this.clickCount === 2) {
      this.positions[0] = new Vector3(this.x, this.y, this.z)

      const geometry = new BufferGeometry()
      this.currentObject = new LineLoop(geometry, this.lineMaterial)
      this.scene.add(this.currentObject)
    }
    if (this.clickCount === 3) {
      this.resetAfterDrawing()
    }
  }

  updateRectangle() {
    if (this.currentObject) {
      this.handleRectangle()
    }
  }

  //Handle box//////////////////////////////////////////////////////////////////////////////////////////
  addPointToBox() {
    if (this.clickCount === 2) {
      this.positions[0] = this.intersect
      this.faces = [0, 3, 2, 0, 2, 1]

      const geometry = new BufferGeometry()
      this.currentObject = new Mesh(geometry, this.materialDraw)
      geometry.setIndex(this.faces)
      this.scene.add(this.currentObject)
    }

    if (this.clickCount === 3) {
      this.referencePlane = new Plane(new Vector3(1, 0, 0)).translate(
        this.positions[2]
      )
    }
    if (this.clickCount === 4) {
      this.currentObject.geometry.computeVertexNormals()
      this.resetAfterDrawing()
    }
  }

  updateBox() {
    if (this.clickCount === 2) {
      this.handleRectangle()
    }
    if (this.clickCount === 3) {
      let x = 0
      if (x === 0) {
        this.faces = [
          0,
          3,
          2,
          0,
          2,
          1,
          1,
          6,
          5,
          1,
          2,
          6,
          5,
          6,
          7,
          4,
          5,
          7,
          0,
          3,
          7,
          0,
          7,
          4,
          0,
          1,
          5,
          0,
          5,
          4,
          3,
          6,
          2,
          7,
          6,
          3,
        ]
        this.currentObject.geometry.setIndex(this.faces)
        x = 1
      }

      this.positions[4] = new Vector3(
        this.positions[0].x,
        this.positions[0].y,
        this.z
      )
      this.positions[5] = new Vector3(
        this.positions[0].x,
        this.positions[2].y,
        this.z
      )
      this.positions[6] = new Vector3(
        this.positions[2].x,
        this.positions[2].y,
        this.z
      )
      this.positions[7] = new Vector3(
        this.positions[2].x,
        this.positions[0].y,
        this.z
      )
      this.currentObject.geometry.setFromPoints(this.positions)
    }
  }

  //Handle sphere//////////////////////////////////////////////////////////////////////////////////////////
  addPointToSphere() {
    if (this.clickCount === 2) {
      const geometry = new SphereGeometry(1, 64, 32)
      this.currentObject = new Mesh(geometry, materialDraw)
      this.currentObject.position.set(this.x, this.y, this.z)
      this.scene.add(this.currentObject)

      //camera target
      const target = this.camera.getWorldDirection(new Vector3())

      this.referencePlane.setFromNormalAndCoplanarPoint(
        target,
        this.currentObject.position
      )
    }

    if (this.clickCount === 3) {
      // this.currentObject.geometry.translate(this.x, this.y, this.z);
      // this.currentObject.position.set(0, 0, 0);
      this.currentObject.geometry.applyMatrix4(this.currentObject.matrix)
      this.currentObject.position.set(0, 0, 0)
      this.currentObject.rotation.set(0, 0, 0)
      this.currentObject.scale.set(1, 1, 1)
      //this.currentObject.updateMatrix();
      console.log(this.currentObject)
      this.resetAfterDrawing()
    }
  }
  updateSphere() {
    if (this.currentObject) {
      const radius = this.currentObject.position.distanceTo(this.intersect)
      this.currentObject.scale.set(radius, radius, radius)
    }
  }
  //Helper functions////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Color easing
  adjustMeshColor() {
    new Tween(this.currentObject.material.color.getHSV())
      .to({ h: h, s: s, v: v }, 200)
      .easing(TWEEN.Easing.Quartic.In)
      .onUpdate(function() {
        this.currentObject.material.color.setHSV(0.7, 0.7, 0.7)
      })
      .start()
  }

  //draw a rectangle
  handleRectangle() {
    this.positions[2] = new Vector3(this.x, this.y, 0)
    this.positions[1] = new Vector3(this.positions[0].x, this.positions[2].y, 0)
    this.positions[3] = new Vector3(this.positions[2].x, this.positions[0].y, 0)
    this.currentObject.geometry.setFromPoints(this.positions)
  }

  resetAfterDrawing() {
    //remove event listeners after drawing
    this.container.removeEventListener('click', this.onMouseClick, false)
    this.container.removeEventListener('mousemove', this.onMouseMove, false)

    //update geometry object frustum
    this.currentObject.geometry.computeBoundingSphere()

    //update material
    if (this.type == 'box' || this.type == 'sphere') {
      this.currentObject.material = this.materialStandard
      this.currentObject.castShadow = true
      this.currentObject.receiveShadow = true
      // this.adjustMeshColor();
    } else {
      this.currentObject.material = this.materialLineDone
    }

    setObjectToRhino(this.currentObject)
  }
}
export { EditModeManager }
