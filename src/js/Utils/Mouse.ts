import * as THREE from 'three'

import Webgl from '../Webgl'

export default class Mouse {
  webgl: Webgl
  raycaster: THREE.Raycaster = new THREE.Raycaster()
  coordinates: THREE.Vector2 = new THREE.Vector2()
  intersects: THREE.Intersection[] = []

  constructor () {
    this.webgl = new Webgl()

    window.addEventListener('mousemove', (event: MouseEvent): void => {
      this.setMouseCoordinates(event)
    })
  }

  private setMouseCoordinates (event: MouseEvent): void {
    this.coordinates.x = (event.clientX / this.webgl.sizes.width) * 2 - 1
    this.coordinates.y = -(event.clientY / this.webgl.sizes.height) * 2 + 1
  }

  public updateMouse (): void {
    this.raycaster.setFromCamera(this.coordinates, this.webgl.camera.instance)
    this.intersects = this.raycaster.intersectObjects(this.webgl.scene.children)

    if (this.intersects.length > 0) {
      console.log('hovered')
    }
  }
}
