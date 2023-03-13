import * as THREE from 'three'

import {
  Camera,
  Render,
  Sizes,
  Mouse,
  Plane,
  Debug,
  Time
} from './Utils'

let instance: Webgl | null = null

export default class Webgl {
  sizes: Sizes
  time: Time
  canvas: HTMLCanvasElement | undefined
  htmlImage: HTMLImageElement | undefined
  camera: Camera
  scene: THREE.Scene
  plane: Plane
  render: Render
  mouse: Mouse
  debug: Debug

  constructor () {
    if (instance != null) {
      return instance
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).webgl = this

    this.sizes = new Sizes()
    this.time = new Time()
    this.canvas = document.querySelector('canvas') === null ? undefined : document.querySelector('canvas') as HTMLCanvasElement | undefined
    this.htmlImage = document.querySelector('img') === null ? undefined : document.querySelector('img') as HTMLImageElement | undefined
    this.initWebgl()
    this.onResizeWindow()

    this.update()

    this.debug = new Debug()
  }

  private initWebgl (): void {
    this.scene = new THREE.Scene()
    this.camera = new Camera(true)

    this.plane = new Plane(this.htmlImage)

    this.render = new Render()
    this.mouse = new Mouse()
  }

  private onResizeWindow (): void {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      this.plane.updateSize()

      this.camera.updateCamera()

      this.render.onResize()
    })
  }

  private update (): void {
    window.requestAnimationFrame(() => { this.update() })

    this.plane.instance.rotation.x += 0.01
    this.plane.instance.rotation.y += 0.01

    this.plane.updatePlane()

    this.mouse.updateMouse()

    this.render.onUpdate()
  }
}
