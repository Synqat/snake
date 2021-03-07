import * as PIXI from 'pixi.js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.PIXI = PIXI
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.PIXI = PIXI

import { Grid } from '@/components/Grid'

const GRID_SIZE = 461
const GRID_SIZE_X = 22
const GRID_SIZE_Y = 22
const GRID_CELL_SIZE = 23

new (class Snake {
  app = new PIXI.Application()
  grid = new Grid(GRID_SIZE_X, GRID_SIZE_Y, GRID_CELL_SIZE)

  activeKey: string | null = null

  constructor() {
    this.app.view.width = GRID_SIZE
    this.app.view.height = GRID_SIZE
    document.body.appendChild(this.app.view)
    this.start()
    this.app.ticker.add(() => this.update())

    document.body.onkeydown = (event) => {
      this.activeKey = event.code
    }
  }

  start() {
    this.grid.stage.x = -GRID_CELL_SIZE
    this.grid.stage.y = -GRID_CELL_SIZE
    this.app.stage.addChild(this.grid.stage)
    this.grid.generate()
  }

  drawing = false
  drawingTimeout?: ReturnType<typeof setTimeout>

  direction = {
    x: 1,
    y: 0,
  }

  reset() {
    this.direction.x = 1
    this.direction.y = 0
    this.grid.tailLength = 3
    this.grid.activeIndex = 23
    this.grid.activeTailIndexes = []
  }

  setIndex() {
    this.drawing = true
    if (this.drawingTimeout) {
      clearTimeout(this.drawingTimeout)
    }

    if (this.grid.activeIndex === this.grid.foodIndex) {
      this.grid.placeFood()
      this.grid.tailLength += 3
    }

    if (this.grid.activeTailIndexes.includes(this.grid.activeIndex)) {
      this.reset()
    }

    this.grid.activeTailIndexes.push(this.grid.activeIndex)
    if (this.grid.activeTailIndexes.length > this.grid.tailLength) {
      this.grid.activeTailIndexes.splice(0, 1)
    }

    if (this.activeKey) {
      switch (this.activeKey) {
        default:
          break
        case 'ArrowUp':
          if (this.direction.y !== 1) {
            this.direction.y = -1
            this.direction.x = 0
          }
          break
        case 'ArrowDown':
          if (this.direction.y !== -1) {
            this.direction.y = 1
            this.direction.x = 0
          }
          break
        case 'ArrowLeft':
          if (this.direction.x !== 1) {
            this.direction.x = -1
            this.direction.y = 0
          }
          break
        case 'ArrowRight':
          if (this.direction.x !== -1) {
            this.direction.x = 1
            this.direction.y = 0
          }
          break
      }
    }

    if (this.direction.y === -1) {
      this.grid.activeIndex -= GRID_SIZE_Y
    }

    if (this.direction.y === 1) {
      this.grid.activeIndex += GRID_SIZE_Y
    }

    if (this.direction.x === -1) {
      this.grid.activeIndex -= 1
    }

    if (this.direction.x === 1) {
      this.grid.activeIndex += 1
    }

    if (this.grid.activeY < 1) {
      this.reset()
    }

    if (this.grid.activeY > 20) {
      this.reset()
    }

    if (this.grid.activeX < 1) {
      this.reset()
    }

    if (this.grid.activeX > 20) {
      this.reset()
    }

    this.activeKey = null

    this.drawingTimeout = setTimeout(() => (this.drawing = false), 75)
  }

  update() {
    this.grid.draw()
    if (!this.drawing) {
      this.setIndex()
    }
  }
})()
