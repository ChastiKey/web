export class ChastiKeyUser {
  public userID!: number
  public username!: string
  public discordID!: string
  public displayInStats!: boolean | number
  public joined!: string
  public keyholderLevel!: number
  public lockeeLevel!: number
  public mainRole!: number
  public status!: number
  public timestampLastActive!: number

  constructor(init?: Partial<ChastiKeyUser>) {
    Object.assign(this, init || {})
  }
}
