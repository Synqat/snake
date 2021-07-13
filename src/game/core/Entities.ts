import { RootInstance } from '..'
import { Entity } from '../core'

export class EntityManager {
  root: RootInstance
  entities: Entity[]

  constructor(root: RootInstance) {
    this.entities = []
    this.root = root
  }

  findOfType<T extends Entity>(
    factory: new (...args: unknown[]) => T,
  ): T | null {
    return (this.entities.find((e) => e instanceof factory) as T) || null
  }

  create<T extends Entity>(factory: new (...args: unknown[]) => T): T {
    const entity = new factory()
    entity.setInput(this.root.input)
    entity.setEntities(this)
    entity.setGrid(this.root.gridRenderer)

    this.entities.push(entity)
    this.root.app.stage.addChild(entity.stage)
    entity.onCreate()

    return entity
  }

  update(delta: number): void {
    this.entities.forEach((e) => e.update(delta))
  }

  draw(): void {
    this.entities.forEach((e) => e.draw())
  }
}
