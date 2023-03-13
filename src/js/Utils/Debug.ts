import * as dat from 'dat.gui'

import Webgl from '../Webgl'

type datGui = dat.GUI

export default class Debug {
  webgl: Webgl
  active: boolean
  ui: datGui
  cameraParameters: datGui

  constructor () {
    this.webgl = new Webgl()

    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.ui = new dat.GUI()

      this.cameraParameters = this.ui.addFolder('Camera')
      this.cameraParameters.add(this.webgl.camera.instance.position, 'x', -100, 100)
      this.cameraParameters.add(this.webgl.camera.instance.position, 'y', -100, 100)
      this.cameraParameters.add(this.webgl.camera.instance.position, 'z', 600, 1000)
    }
  }
}
