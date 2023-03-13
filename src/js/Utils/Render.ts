import * as THREE from 'three'

import Webgl from '../Webgl'

export default class Render {
  webgl: Webgl
  instance: THREE.WebGLRenderer

  constructor () {
    this.webgl = new Webgl()

    this.instance = new THREE.WebGLRenderer({
      canvas: this.webgl.canvas as HTMLCanvasElement | undefined,
      antialias: true,
      alpha: false
    })

    this.instance.setSize(this.webgl.sizes.width, this.webgl.sizes.height)
    this.instance.setPixelRatio(this.webgl.sizes.pixelRatio)
  }

  public onResize (): void {
    this.instance.setSize(this.webgl.sizes.width, this.webgl.sizes.height)
    this.instance.setPixelRatio(this.webgl.sizes.pixelRatio)
  }

  public onUpdate (): void {
    this.instance.render(this.webgl.scene, this.webgl.camera.instance)
  }
}
