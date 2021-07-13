import { Application } from 'pixi.js'
import { EntityManager } from './core/Entities'
import { GridRenderer } from './core/GridRenderer'
import { Input } from './core/Input'
import { Food } from './entities/Food'
import { Player } from './entities/Player'

const GRID_SIZE_X = 24
const GRID_SIZE_Y = 24
const GRID_CELL_SIZE = 24
const GRID_SIZE = GRID_SIZE_X * GRID_CELL_SIZE

let last = 0

const storedDeaths = window.localStorage.getItem('deaths')
export class RootInstance {
  hasPrintedSettings = false

  startButton = document.getElementById('start-button')

  // noms = [
  //   PIXISound.Sound.from('./public/eat1.wav'),
  //   PIXISound.Sound.from('./public/eat2.wav'),
  //   PIXISound.Sound.from('./public/eat3.wav'),
  // ]
  // dead = PIXISound.Sound.from('./public/dead.wav')
  // move = PIXISound.Sound.from('./public/move.wav')

  app: Application

  // Core services
  entities: EntityManager
  gridRenderer: GridRenderer
  input: Input

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

  constructor() {
    //@ts-ignore - This is actually kind of cringe
    this.app = new Application(GRID_SIZE, GRID_SIZE, {
      width: GRID_SIZE,
      height: GRID_SIZE,
      sharedTicker: false,
      autoStart: false,
    })
    this.app.renderer.clearBeforeRender = true

    this.input = new Input(document)
    this.gridRenderer = new GridRenderer(
      {
        x: GRID_SIZE_X,
        y: GRID_SIZE_Y,
      },
      {
        x: GRID_CELL_SIZE,
        y: GRID_CELL_SIZE,
      },
    )
    this.entities = new EntityManager(this)

    this.entities.create(Player)
    this.entities.create(Food)

    const container = document.getElementById('container')
    if (!container) {
      throw new Error('missing container')
    }
    container.innerHTML = ''
    container.appendChild(this.app.view)

    this.startButton = document.getElementById('start-button')
    if (this.startButton) {
      //      this.startButton.addEventListener('click', this.actuallyReset.bind(this))
    }

    this.app.view.width = GRID_SIZE
    this.app.view.height = GRID_SIZE

    this.start()
  }

  tick(delta: number): void {
    // @ts-ignore
    const FPS = window.GLOBAL_SPEED || 10
    const INTERVAL = (1e3 / FPS) | 0

    requestAnimationFrame(this.tick.bind(this))

    const now = performance.now() | 0 // Fix occasional drop-off frames
    const elapsed = now - last

    if (elapsed < INTERVAL) return

    this.update(delta)

    // Excellent
    last = now - (elapsed % INTERVAL)
  }

  start(): void {
    this.tick(0)
  }

  updateScore(): void {
    // TODO: Implement score
  }

  update(_delta: number): void {
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

    this.updateScore()

    this.entities.update(_delta)

    this.gridRenderer.default()
    this.entities.draw()

    this.gridRenderer.draw()
  }
}
