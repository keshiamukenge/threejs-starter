export default class Sizes {
  width: number
  height: number
  pixelRatio: number

  constructor () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.onResizeWindow()
  }

  private onResizeWindow (): void {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    })
  }
}
