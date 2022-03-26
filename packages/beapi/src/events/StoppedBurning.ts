import type { PlayerTagEvent } from '..'
import type { Client } from '../client'
import { setProto } from '../'
import AbstractEvent from './AbstractEvent'
export class StoppedBurning extends AbstractEvent {
  protected readonly _logic = this.__logic.bind(this)
  protected readonly _client: Client
  protected _registered = false

  @setProto('StoppedBurning')
  public readonly name = 'StoppedBurning'

  @setProto('custom')
  public readonly iName = 'custom'

  public readonly alwaysCancel = false

  public constructor(client: Client) {
    super()
    this._client = client
  }

  public on(): void {
    if (!this._registered) {
      this._client.addListener('PlayerTag', this._logic)
    }
  }

  public off(): void {
    if (this._registered) {
      this._client.removeListener('PlayerTag', this._logic)
    }
  }

  protected __logic(data: PlayerTagEvent): void {
    if (data.tag !== 'off_fire') return
    data.player.isBurning(false)
    this._client.emit(this.name, data.player)
  }
}
