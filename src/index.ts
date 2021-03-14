import * as PIXI from 'pixi.js'
import PIXISound from 'pixi-sound'

// @ts-ignore
global.PIXI = PIXI
// @ts-ignore
window.PIXI = PIXI

import { Grid } from '@/components/Grid'

const GRID_SIZE = 461
const GRID_SIZE_X = 22
const GRID_SIZE_Y = 22
const GRID_CELL_SIZE = 23

let last = 0

const storedDeaths = window.localStorage.getItem('deaths')

new (class Snake {
  hasPrintedSettings = false

  startButton = document.getElementById('start-button')

  noms = [
    PIXISound.Sound.from('./public/eat1.wav'),
    PIXISound.Sound.from('./public/eat2.wav'),
    PIXISound.Sound.from('./public/eat3.wav'),
  ]
  dead = PIXISound.Sound.from('./public/dead.wav')
  move = PIXISound.Sound.from('./public/move.wav')

  // @ts-ignore
  app = new PIXI.Application(GRID_SIZE, GRID_SIZE, {
    sharedTicker: false,
    autoStart: false,
  })

  grid = new Grid(GRID_SIZE_X, GRID_SIZE_Y, GRID_CELL_SIZE)

  activeKey: string | null = null

  score = 0
  deaths =
    storedDeaths && typeof storedDeaths === 'string'
      ? parseInt(storedDeaths)
      : 0
  deathKeep = document.getElementById('deaths')
  scoreKeep = document.getElementById('score')

  isResetting = true

  direction = {
    x: 1,
    y: 0,
  }

  actuallyReset() {
    this.direction.x = 1
    this.direction.y = 0
    this.grid.tailLength = 3
    this.grid.activeIndex = 200
    this.grid.activeTailIndexes = []
  }

  constructor() {
    document.body.appendChild(this.app.view)

    this.startButton = document.getElementById('start-button')
    this.app.view.width = GRID_SIZE
    this.app.view.height = GRID_SIZE

    document.body.onkeydown = (event) => {
      if (this.isResetting) {
        if (['Enter', 'Space'].includes(event.code)) {
          this.actuallyReset()
          setTimeout(() => {
            this.isResetting = false
            this.startButton?.classList.add('hidden')
          }, 120)
        }
      } else {
        this.activeKey = event.code
      }
    }

    this.start()
  }

  tick(delta: number) {
    // @ts-ignore
    const FPS = window.GLOBAL_SPEED || 10
    const INTERVAL = (1e3 / FPS) | 0

    requestAnimationFrame(this.tick.bind(this))

    const now = performance.now() | 0 // Fix occasional drop-off frames
    const elapsed = now - last

    if (elapsed < INTERVAL) return

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

    this.update(delta)

    // Excellent
    last = now - (elapsed % INTERVAL)
  }

  start() {
    this.grid.stage.x = -GRID_CELL_SIZE
    this.grid.stage.y = -GRID_CELL_SIZE
    this.app.stage.addChild(this.grid.stage)
    this.grid.generate()

    this.tick(0)

    const loader = document.getElementById('loading')
    if (loader) {
      loader.style.display = 'none'
    }
  }

  reset() {
    if (this.startButton) {
      this.startButton.innerText = 'Reset'
      this.startButton.classList.remove('hidden')
    }
    this.dead.play()
    this.isResetting = true
    this.deaths += 1
    window.localStorage.setItem('deaths', String(this.deaths))
  }

  handleMovement() {
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
      this.noms[Math.floor(Math.random() * this.noms.length)].play()
      this.grid.placeFood()
      this.grid.tailLength += 3
    }

    this.grid.activeTailIndexes.push(this.grid.activeIndex)
    if (this.grid.activeTailIndexes.length > this.grid.tailLength) {
      this.grid.activeTailIndexes.splice(0, 1)
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

    this.move.play()

    this.activeKey = null
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

  update(_delta: number) {
    if (!this.hasPrintedSettings) {
      this.hasPrintedSettings = true
      console.log(
        `Hello gamer!
  Settings:
%c|    GLOBAL_SPEED = 10    |
`,
        'color: white; background-color: black;',
      )
    }

    if (!this.isResetting) {
      this.handleMovement()
    }

    this.updateScore()
    this.grid.draw()

    if (!this.startButton) {
      this.startButton = document.getElementById('start-button')

      if (this.startButton) {
        this.startButton.onclick = () => {
          this.actuallyReset()
          setTimeout(() => {
            this.isResetting = false
            this.startButton?.classList.add('hidden')
          }, 120)
        }
      }
    }
  }
})()
