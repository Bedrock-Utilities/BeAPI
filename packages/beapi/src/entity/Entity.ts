import type {
  Dimension as IDimension,
  Effect,
  EffectType,
  Entity as IEntity,
  EntityHealthComponent,
  EntityInventoryComponent,
  Vector,
} from 'mojang-minecraft'
import type { Client } from '../client'
import type { Location, Dimension, ServerCommandResponse, EntityComponents } from '../types'
import { Location as ILocation } from 'mojang-minecraft'
import { getUniqueId } from '../utils'

export class Entity {
  protected readonly _client: Client
  protected readonly _IEntity: IEntity
  protected readonly _runtimeId: number
  protected readonly _uniqueId: number
  public constructor(client: Client, entity: IEntity) {
    this._client = client
    this._IEntity = entity
    this._runtimeId = this._client.entities.newRuntimeId()
    this._uniqueId = getUniqueId(this)
  }

  public destroy(): void {
    try {
      this._IEntity.kill()
    } catch {}
  }

  public getIEntity(): IEntity {
    return this._IEntity
  }

  public getRuntimeId(): number {
    return this._runtimeId
  }

  public getId(): string {
    return this._IEntity.id
  }

  public getUniqueId(): number {
    return this._uniqueId
  }

  public getNameTag(): string {
    return this._IEntity.nameTag
  }

  public setNameTag(nametag: string): void {
    this._IEntity.nameTag = nametag
  }

  public getTags(): string[] {
    return this._IEntity.getTags()
  }

  public hasTag(tag: string): boolean {
    return this._IEntity.hasTag(tag)
  }

  public addTag(tag: string): boolean {
    return this._IEntity.addTag(tag)
  }

  public removeTag(tag: string): boolean {
    return this._IEntity.removeTag(tag)
  }

  public executeCommand(cmd: string, debug = false): ServerCommandResponse {
    try {
      const command = this._IEntity.runCommand(cmd)

      return {
        statusMessage: command.statusMessage,
        data: command,
        err: false,
      }
    } catch (error) {
      if (debug) console.warn(`[BeAPI] [Entity#executeCommand]: ${String(error)}`)

      return {
        statusMessage: String(error),
        data: null,
        err: true,
      }
    }
  }

  public getScore(objective: string): number {
    const command = this.executeCommand(`scoreboard players test @s "${objective}" * *`)
    if (command.err) return 0

    return parseInt(String(command.statusMessage?.split(' ')[1]), 10)
  }

  public setScore(objective: string, amount: number): void {
    this.executeCommand(`scoreboard players set @s "${objective}" ${amount}`)
  }

  public addScore(objective: string, amount: number): void {
    this.executeCommand(`scoreboard players add @s "${objective}" ${amount}`)
  }

  public removeScore(objective: string, amount: number): void {
    this.executeCommand(`scoreboard players remove @s "${objective}" ${amount}`)
  }

  public getLocation(): Location {
    const pos = this._IEntity.location

    return {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      z: Math.floor(pos.z),
    }
  }

  public getDimension(): IDimension {
    return this._IEntity.dimension
  }

  public getDimensionName(): Dimension {
    // TEMP: Until types get updated
    const id = ((this.getDimension() as any).id as string).split(':')[1].replace(/_/g, ' ')

    return id as Dimension
  }

  public getInventory(): EntityInventoryComponent | undefined {
    if (!this._IEntity.hasComponent('minecraft:inventory')) return

    return this._IEntity.getComponent('minecraft:inventory') as EntityInventoryComponent
  }

  public getHealth(): EntityHealthComponent {
    return this._IEntity.getComponent('minecraft:health') as EntityHealthComponent
  }

  public getVelocity(): Vector {
    return this._IEntity.velocity
  }

  public setVelocity(velocity: Vector): void {
    this._IEntity.setVelocity(velocity)
  }

  public teleport(location: Location, dimension: IDimension, xrot: number, yrot: number): void {
    const loc = new ILocation(location.x, location.y, location.z)
    this._IEntity.teleport(loc, dimension, xrot, yrot)
  }

  public teleportFacing(location: Location, dimension: IDimension, facingLocation: Location): void {
    const loc = new ILocation(location.x, location.y, location.z)
    const loc2 = new ILocation(facingLocation.x, facingLocation.y, facingLocation.z)
    this._IEntity.teleportFacing(loc, dimension, loc2)
  }

  public triggerEvent(event: string): void {
    this._IEntity.triggerEvent(event)
  }

  public getRotation(): number {
    return this._IEntity.bodyRotation
  }

  public getHeadLocation(): ILocation {
    return this._IEntity.headLocation
  }

  public getComponent<K extends keyof EntityComponents>(component: K): EntityComponents[K] {
    return this._IEntity.getComponent(component) as any
  }

  public hasComponent<K extends keyof EntityComponents>(component: K): boolean {
    return this._IEntity.hasComponent(component)
  }

  public addEffect(effect: EffectType, duration: number, amplifier: number): void {
    return this._IEntity.addEffect(effect, duration, amplifier)
  }

  public getEffect(effect: EffectType): Effect {
    return this._IEntity.getEffect(effect)
  }
}
