export default class Time {
  readonly start: number
  current: number
  elapsed: number
  delta: number

  constructor () {
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    this.tick()
  }

  public tick (): void {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    window.requestAnimationFrame(this.tick.bind(this))
  }
}
