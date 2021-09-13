import { World } from 'Minecraft'
import { EventManager } from '../EventManager.js'

export class Tick {
  private _events: EventManager
  public eventName = 'tick'
  public ticks = 0

  constructor (events: EventManager) {
    this._events = events
    World.events.tick.subscribe(() => {
      this.ticks++
      this._events.emit('tick', this.ticks)
    })
  }
}