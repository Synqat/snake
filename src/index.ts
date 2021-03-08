// @ts-ignore
import * as PIXI from 'pixi.js'

// @ts-ignore
global.PIXI = PIXI
// @ts-ignore
window.PIXI = PIXI

import { Grid } from '@/components/Grid'

const GRID_SIZE = 461
const GRID_SIZE_X = 22
const GRID_SIZE_Y = 22
const GRID_CELL_SIZE = 23

const storedDeaths = window.localStorage.getItem('deaths')

new (class Snake {
  // @ts-ignore
  app = new PIXI.Application()
  grid = new Grid(GRID_SIZE_X, GRID_SIZE_Y, GRID_CELL_SIZE)

  activeKey: string | null = null

  score = 0
  deaths =
    storedDeaths && typeof storedDeaths === 'string'
      ? parseInt(storedDeaths)
      : 0
  deathKeep = document.getElementById('deaths')
  scoreKeep = document.getElementById('score')

  constructor() {
    this.app.view.width = GRID_SIZE
    this.app.view.height = GRID_SIZE
    document.body.appendChild(this.app.view)
    this.start()
    this.app.ticker.add(() => this.update())

    document.body.onkeydown = (event) => {
      if (this.isResetting) {
        this.direction.x = 1
        this.direction.y = 0
        this.grid.tailLength = 3
        this.grid.activeIndex = 200
        this.grid.activeTailIndexes = []

        this.isResetting = false
      }
      this.activeKey = event.code
    }

    let touchstartX = 0
    let touchstartY = 0
    let touchendX = 0
    let touchendY = 0

    // @ts-ignore
    const dragStart = function (event) {
      // @ts-ignore
      touchstartX = event.screenX
      // @ts-ignore
      touchstartY = event.screenY
    }

    // @ts-ignore
    const dragEnd = function (event) {
      // @ts-ignore
      touchendX = event.screenX
      // @ts-ignore
      touchendY = event.screenY
      handleGesture()
    }

    document.body.addEventListener('touchstart', dragStart, false)

    document.body.addEventListener('touchend', dragEnd, false)

    const handleGesture = () => {
      if (touchendX < touchstartX) {
        this.activeKey = 'ArrowUp'
      }
      if (touchendX > touchstartX) {
        this.activeKey = 'ArrowRight'
      }
      if (touchendY < touchstartY) {
        this.activeKey = 'ArrowDown'
      }
      if (touchendY > touchstartY) {
        this.activeKey = 'ArrowLeft'
      }
    }
  }

  start() {
    this.grid.stage.x = -GRID_CELL_SIZE
    this.grid.stage.y = -GRID_CELL_SIZE
    this.app.stage.addChild(this.grid.stage)
    this.grid.generate()
  }

  drawing = false
  isResetting = false
  drawingTimeout?: ReturnType<typeof setTimeout>

  direction = {
    x: 1,
    y: 0,
  }

  reset() {
    this.drawing = false
    this.isResetting = true
    this.deaths += 1
    window.localStorage.setItem('deaths', String(this.deaths))
  }

  handleMovement() {
    this.drawing = true
    if (this.drawingTimeout) {
      clearTimeout(this.drawingTimeout)
    }

    if (this.grid.activeTailIndexes.includes(this.grid.activeIndex)) {
      return this.reset()
    }

    if (this.grid.activeY < 1) {
      return this.reset()
    }

    if (this.grid.activeY > 20) {
      return this.reset()
    }

    if (this.grid.activeX < 1) {
      return this.reset()
    }

    if (this.grid.activeX > 20) {
      return this.reset()
    }

    if (this.grid.activeIndex === this.grid.foodIndex) {
      this.grid.placeFood()
      this.grid.tailLength += 3
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

    this.activeKey = null

    this.drawingTimeout = setTimeout(() => (this.drawing = false), 75)
  }

  updateScore() {
    if (this.scoreKeep && this.score !== this.grid.tailLength) {
      this.score = this.grid.tailLength
      this.scoreKeep.innerText = String(this.score)
    }

    if (this.deathKeep && this.deaths !== Number(this.deathKeep.innerText)) {
      this.deathKeep.innerText = String(this.deaths)
    }
  }

  update() {
    this.grid.draw()
    if (!this.drawing && !this.isResetting) {
      this.handleMovement()
    }
    this.updateScore()
  }
})()
