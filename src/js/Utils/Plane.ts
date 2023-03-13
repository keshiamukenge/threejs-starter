import * as THREE from 'three'

import Webgl from '../Webgl'

type IsHtmlImageElement = HTMLImageElement | undefined | null

export default class Plane {
  webgl: Webgl
  imageElement: IsHtmlImageElement
  image: {
    element: IsHtmlImageElement
    src: string
    width: number
    height: number
    aspect: number
    top: number
    left: number
  }

  texture: THREE.Texture
  geometry: THREE.PlaneGeometry
  material: THREE.ShaderMaterial
  instance: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  instanceOffset: number

  constructor (htmlImage: IsHtmlImageElement) {
    this.webgl = new Webgl()

    if (htmlImage == null) return

    this.imageElement = htmlImage

    this.image = {
      element: this.imageElement,
      src: this.imageElement.src,
      width: this.imageElement.getBoundingClientRect().width,
      height: this.imageElement.getBoundingClientRect().height,
      aspect: this.imageElement.offsetWidth / this.imageElement.offsetHeight,
      top: this.imageElement.getBoundingClientRect().top,
      left: this.imageElement.getBoundingClientRect().left
    }

    this.texture = new THREE.TextureLoader().load(this.image.src)

    this.setupPlane()
  }

  private setupPlane (): void {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
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
        }
      },
      vertexShader: `
        uniform vec2 uMouse;
        uniform float uTime;

        varying vec2 vUv;
        
        void main() {
          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;

        varying vec2 vUv;
 
        void main() {
          vec4 texture = texture2D(uTexture, vUv);

          gl_FragColor = vec4(texture);
        }
      `
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
  }

  public updatePlanePosition (): void {
    this.instance.position.set(
      this.image.left - this.webgl.sizes.width / 2 + this.image.width / 2,
      this.image.top + this.webgl.sizes.height / 2 - this.image.height / 2,
      1
    )
  }

  public updatePlane (): void {
    this.updateImagePosition()
    this.updatePlanePosition()

    this.texture.needsUpdate = true

    this.instance.material.uniforms.uMouse.value = this.webgl.mouse.coordinates
    this.instance.material.uniforms.uTime.value = this.webgl.time.elapsed
  }

  public updateSize (): void {
    this.updatePlaneSize()
    this.updateImageSize()
  }
}
