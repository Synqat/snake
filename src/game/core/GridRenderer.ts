import { Graphics } from 'pixi.js'
import { Entity } from '../core'
import { Vector2 } from '../models/Vector2'

type GridCell = {
  color: number
  border: number
}

export class GridRenderer extends Entity {
  cells: Array<GridCell> = []
  cellDrawables: Array<Graphics> = []
  size: Vector2
  cellSize: Vector2

  constructor(size: Vector2, cellSize?: Vector2) {
    super()

    this.size = size
    this.cellSize = cellSize || { x: 1, y: 1 }

    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this.cells.push({
          color: 0,
          border: 0x1c1c1c,
        })
        const drawable = new Graphics()
        this.cellDrawables.push(drawable)
        this.stage.addChild(drawable)
      }
    }
  }

  setCell(x: number, y: number, cell: GridCell): void {
    const currentCell = this.cells[x + y * this.cells.length]
    if (!currentCell) {
      return
    }

    this.cells[x + y * this.cells.length].color = cell.color
    this.cells[x + y * this.cells.length].border = cell.border
  }

  getCell(x: number, y: number): GridCell | null {
    if (x > this.size.x || y > this.size.y || x < 0 || y < 0) {
      return null
    }
    return this.cells[x + y * this.cells.length]
  }

  default(): void {
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        this.setCell(x, y, {
          color: 0,
          border: 0x1c1c1c,
        })
      }
    }
  }

  override draw(): void {
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        const index = x + y * this.size.y
        const cell = this.cells[index]
        if (!cell) {
          continue
        }

        const cellDrawable = this.cellDrawables[index]

        cellDrawable.clear()
        cellDrawable.lineStyle(1, cell.border, 1)
        cellDrawable.beginFill(cell.color)
        cellDrawable.drawRect(
          x * this.cellSize.x,
          y * this.cellSize.y,
          this.cellSize.x,
          this.cellSize.y,
        )
        cellDrawable.endFill()
      }
    }
  }
}
