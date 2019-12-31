export class KieraCachedSession {
  public session!: string
  public userID!: string
  public username!: string

  constructor(init: Partial<KieraCachedSession>) {
    Object.assign(this, init)
  }

  public get isCached(): boolean {
    return this.session !== undefined && this.username !== undefined
  }
}
