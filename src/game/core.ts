import { Container } from 'pixi.js'
import { EntityManager } from './core/Entities'
import { GridRenderer } from './core/GridRenderer'
import { Input } from './core/Input'
import { Vector2 } from './models/Vector2'

export class Entity {
  stage: Container
  private input?: Input
  private entities?: EntityManager
  private grid?: GridRenderer

  protected position: Vector2 = { x: 0, y: 0 }

  constructor() {
    this.stage = new Container()
  }

  setInput(input: Input): void {
    this.input = input
  }

  setEntities(entities: EntityManager): void {
    this.entities = entities
  }

  setGrid(grid: GridRenderer): void {
    this.grid = grid
  }

  getGrid(): GridRenderer {
    if (!this.grid) {
      throw new Error('No grid defined for this entity')
    }
    return this.grid
  }

  getInput(): Input {
    if (!this.input) {
      throw new Error('No input defined for this entity')
    }
    return this.input
  }

  getEntities(): EntityManager {
    if (!this.entities) {
      throw new Error('No entities defined for this entity')
    }
    return this.entities
  }

  getPosition(): Vector2 {
    return this.position
  }

  // Events
  onCreate(): void {
    // Do nothing
  }

  update(delta: number): void {
    // Nothing is defined here by default
  }

  draw(): void {
    // Nothing is defined here by default
  }
}

export interface IDrawingContext {
  container: Container
}
