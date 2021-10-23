import { Box3 } from 'three'

function createBoundingBox(objects) {
  //check if its children array

  const box = new Box3()

  //expand boundingbox
  box.expandByObject(objects)

  return box
}

export { createBoundingBox }
