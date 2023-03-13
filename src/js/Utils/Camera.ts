import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Webgl from '../Webgl'

type OrbitControlsIsActive = boolean

export default class Camera {
  webgl: Webgl
  instance: THREE.PerspectiveCamera
  orbitControlIsActive: OrbitControlsIsActive
  controls: OrbitControls

  constructor (activeOrbitControls: OrbitControlsIsActive) {
    this.webgl = new Webgl()

    this.orbitControlIsActive = activeOrbitControls

    // Set camera
    this.initCamera()

    if (activeOrbitControls) {
      this.setOrbitcontrols()
    }

    this.resize()
  }

  private initCamera (): void {
    this.instance = new THREE.PerspectiveCamera(
      70,
      this.webgl.sizes.width / this.webgl.sizes.height,
      100,
      2000
    )
    this.instance.position.z = 600
    this.instance.fov = 2 * Math.atan((this.webgl.sizes.height / 2) / this.instance.position.z) * (180 / Math.PI)

    this.webgl.scene.add(this.instance)
  }

  private setOrbitcontrols (): void {
    if (this.webgl.canvas == null) return

    this.controls = new OrbitControls(this.instance, this.webgl.canvas)
    this.controls.enableDamping = true
  }

  private resize (): void {
    this.instance.aspect = this.webgl.sizes.width / this.webgl.sizes.height
    this.instance.updateProjectionMatrix()
  }

  public updateCamera (): void {
    if (this.orbitControlIsActive) {
      this.controls.update()
    }
  }
}
