import * as THREE from 'three'

import Webgl from '../Webgl'
import { fragmentShader } from './shaders/fragmentShader'
import { vertexShader } from './shaders/vertexShader'

export default class Plane {
  webgl: Webgl
  imageElement: HTMLImageElement
  image: {
    element: HTMLImageElement
    src: string
    width: number
    height: number
    aspect: number
    top: number
    left: number
    naturalWidth: number
    naturalHeight: number
  }

  texture: THREE.Texture
  textureIsLoaded: boolean
  geometry: THREE.PlaneGeometry
  material: THREE.ShaderMaterial
  instance: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  instanceOffset: number

  constructor (htmlImage: HTMLImageElement) {
    this.textureIsLoaded = false
    this.webgl = new Webgl()

    if (htmlImage === null) return

    this.imageElement = htmlImage

    this.image = {
      element: this.imageElement,
      src: this.imageElement.src,
      width: this.imageElement.getBoundingClientRect().width,
      height: this.imageElement.getBoundingClientRect().height,
      aspect: this.imageElement.offsetWidth / this.imageElement.offsetHeight,
      top: this.imageElement.getBoundingClientRect().top,
      left: this.imageElement.getBoundingClientRect().left,
      naturalWidth: this.imageElement.naturalWidth,
      naturalHeight: this.imageElement.naturalHeight
    }

    this.texture = new THREE.TextureLoader().load(this.image.src, () => {
      this.setupPlane()
      this.textureIsLoaded = true
    })
  }

  private setupPlane (): void {
    this.geometry = new THREE.PlaneGeometry(1, 1, 30, 30)
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {
          value: this.texture
        },
        uMouse: {
          value: new THREE.Vector2(0.0, 0.0)
        },
        uTime: {
          value: 0.0
        },
        uPlaneSize: {
          value: new THREE.Vector2(this.image.width, this.image.height)
        },
        uImageSize: {
          value: new THREE.Vector2(this.image.naturalWidth, this.image.naturalHeight)
        }
      },
      vertexShader,
      fragmentShader
    })
    this.instance = new THREE.Mesh(this.geometry, this.material)
    this.instance.scale.set(this.image.width, this.image.height, 1)
    this.instanceOffset = this.instance.scale.y / 2

    this.webgl.scene.add(this.instance)
  }

  public updateImageSize (): void {
    if (this.imageElement == null) return

    this.image.width = this.imageElement.getBoundingClientRect().width
    this.image.height = this.imageElement.getBoundingClientRect().height
    this.image.aspect = this.imageElement.offsetWidth / this.imageElement.offsetHeight
  }

  public updateImagePosition (): void {
    if (this.imageElement == null) return

    this.image.top = -this.imageElement.getBoundingClientRect().top
    this.image.left = this.imageElement.getBoundingClientRect().left
  }

  public updatePlaneSize (): void {
    this.instance.scale.set(this.image.width, this.image.height, 1)
    this.material.uniforms.uPlaneSize.value = new THREE.Vector2(this.image.width, this.image.height)
  }

  public updatePlanePosition (): void {
    this.instance.position.set(
      this.image.left - this.webgl.sizes.width / 2 + this.image.width / 2,
      this.image.top + this.webgl.sizes.height / 2 - this.image.height / 2,
      1
    )
  }

  public updatePlane (): void {
    if (!this.textureIsLoaded) return

    this.updateImagePosition()
    this.updatePlanePosition()

    this.texture.needsUpdate = true

    this.instance.material.uniforms.uMouse.value = this.webgl.mouse.coordinates
    this.instance.material.uniforms.uTime.value = this.webgl.time.elapsed
  }

  public updateSize (): void {
    if (!this.textureIsLoaded) return

    this.updatePlaneSize()
    this.updateImageSize()
  }

  public rotate (): void {
    if (!this.textureIsLoaded) return

    this.instance.rotation.x += 0.01
    this.instance.rotation.y += 0.01
  }
}
