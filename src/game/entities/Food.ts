import { Graphics } from 'pixi.js'
import { Entity } from '../core'

export class Food extends Entity {
  drawable: Graphics = new Graphics()

  override onCreate() {
    this.drawable = new Graphics()
    this.drawable.beginFill(0xff0000, 0.5)
    this.drawable.drawRect(
      0,
      0,
      this.getGrid().cellSize.x,
      this.getGrid().cellSize.y,
    )
    this.drawable.endFill()
    this.stage.addChild(this.drawable)
  }

  newPosition(): void {
    this.position = {
      x:
        Math.floor(Math.random() * this.getGrid().size.x) *
        this.getGrid().cellSize.x,
      y:
        Math.floor(Math.random() * this.getGrid().size.y) *
        this.getGrid().cellSize.y,
    }
    this.drawable.position.x = this.position.x
    this.drawable.position.y = this.position.y
  }
}
