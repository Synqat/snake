import { Graphics } from 'pixi.js'
import { Entity } from '../core'
import { Equals, Vector2 } from '../models/Vector2'
import { Food } from './Food'

export class Player extends Entity {
  direction: Vector2 = { x: 0, y: 0 }
  size = 0
  positionHistory: Vector2[] = []
  headDrawable = new Graphics()
  tailDrawables: Graphics[] = []
  dead = false

  override onCreate(): void {
    this.position = { x: 0, y: 0 }
    this.direction = { x: 1, y: 0 }
    this.size = 0
    this.positionHistory = []
    this.tailDrawables = []

    this.createHead()
  }

  createHead(): void {
    this.headDrawable = new Graphics()
    this.headDrawable.beginFill(0xffffff)
    this.headDrawable.drawRect(this.position.x, this.position.y, 24, 24)
    this.headDrawable.endFill()
    this.stage.addChild(this.headDrawable)
  }

  createTail(): void {
    const tailPiece = new Graphics()
    tailPiece.beginFill(0xffffff)
    tailPiece.drawRect(this.position.x, this.position.y, 24, 24)
    tailPiece.endFill()
    this.tailDrawables.push(tailPiece)
    this.stage.addChild(tailPiece)
  }

  die(): void {
    this.dead = true
  }

  override update(delta: number): void {
    super.update(delta)

    if (this.dead) {
      return
    }

    this.positionHistory.push({
      x: this.position.x,
      y: this.position.y,
    })
    if (this.positionHistory.length > this.size) {
      this.positionHistory.shift()
    }

    this.position.x += this.direction.x * this.getGrid().cellSize.x
    this.position.y += this.direction.y * this.getGrid().cellSize.y

    // Handle overflow for the head
    if (this.position.x > this.getGrid().size.x * this.getGrid().cellSize.x) {
      this.position.x = 0
    } else if (this.position.x < 0) {
      this.position.x = this.getGrid().size.x * this.getGrid().cellSize.x
    }

    if (this.position.y > this.getGrid().size.y * this.getGrid().cellSize.y) {
      this.position.y = 0
    } else if (this.position.y < 0) {
      this.position.y = this.getGrid().size.y * this.getGrid().cellSize.y
    }

    if (this.positionHistory.find((p) => Equals(p, this.position)) != null) {
      this.die()
    }

    this.headDrawable.position.x = this.position.x
    this.headDrawable.position.y = this.position.y

    const food = this.getEntities().findOfType(Food)
    if (!!food && Equals(food.getPosition(), this.position)) {
      console.log('nom', food.getPosition(), this.position)
      this.size++
      this.createTail()
      food.newPosition()
    }

    this.getInput().onAnyKeysDown(
      ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'],
      (key) => {
        this.direction = { x: 0, y: 0 }

        switch (key) {
          case 'ArrowLeft':
            this.direction.x = -1
            break
          case 'ArrowRight':
            this.direction.x = 1
            break
          case 'ArrowUp':
            this.direction.y = -1
            break
          case 'ArrowDown':
            this.direction.y = 1
            break
        }
      },
    )
  }

  override draw(): void {
    super.draw()

    for (let i = 0; i < this.positionHistory.length; i++) {
      if (!this.tailDrawables[i]) {
        continue
      }
      this.tailDrawables[i].clear()
      this.tailDrawables[i].beginFill(0xffffff, this.positionHistory.length / i)
      this.tailDrawables[i].drawRect(0, 0, 24, 24)
      this.tailDrawables[i].endFill()

      this.tailDrawables[i].position.x = this.positionHistory[i].x
      this.tailDrawables[i].position.y = this.positionHistory[i].y
    }
  }
}
