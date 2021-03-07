import { Container, Graphics } from 'pixi.js'

const GRID_OFFSET = 1

export class Grid {
  sizeX: number
  sizeY: number
  cellSize: number

  activeX = 1
  activeY = 1
  tailLength = 3
  activeIndex = 23
  foodIndex = 63
  activeTailIndexes: number[] = []

  stage = new Container()
  cells: Container[] = []

  constructor(sizeX: number, sizeY: number, cellSize: number) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.cellSize = cellSize
  }

  generate(): void {
    const { sizeX, sizeY, stage, cellSize } = this

    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        const index = x + y * sizeY

        const xPos = x * cellSize
        const yPos = y * cellSize + GRID_OFFSET

        const rect = new Container()

        rect.x = xPos
        rect.y = yPos

        // rect.interactive = true
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // rect.mouseover = () => {
        //   this.activeIndex = index
        // }

        this.cells[index] = rect
      }
    }

    stage.addChild(...this.cells)
  }

  placeFood(): void {
    const foodIndex = Math.floor(Math.random() * this.cells.length)
    if (
      !this.activeTailIndexes.includes(foodIndex) &&
      foodIndex !== this.activeIndex
    ) {
      this.foodIndex = foodIndex
    } else {
      this.placeFood()
    }
  }

  draw(): void {
    const {
      sizeX,
      sizeY,
      cells,
      activeIndex,
      activeTailIndexes,
      cellSize,
      foodIndex,
    } = this

    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        const index = x + y * sizeY

        const rectGraphic = new Graphics()
        const rect = cells[index]

        rect.removeChildren()

        if (activeIndex === index) {
          this.activeX = x
          this.activeY = y
        }

        if (index !== foodIndex) {
          if (activeIndex === index) {
            rectGraphic.beginFill(0x7aa3d6)
          } else if (activeTailIndexes.includes(index)) {
            rectGraphic.beginFill(
              0x5d8fc2,
              (activeTailIndexes.indexOf(index) * 10) /
                activeTailIndexes.length,
            )
          } else {
            rectGraphic.beginFill()

            rectGraphic.lineStyle(1, 0x1c1c1c, 1)
          }
        } else {
          if (x < 1 || x > 20 || y < 1 || y > 20) {
            this.placeFood()
          }
          rectGraphic.beginFill(0xb3ffd6)
        }

        rectGraphic.drawRect(1, -1, cellSize, cellSize)

        rectGraphic.endFill()
        rect.addChild(rectGraphic)
      }
    }
  }
}
