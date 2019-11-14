export class LockeeCached {
  public username!: string
  public joined!: string
  public timestampLastActive!: number
  public secondsLockedInCurrentLock!: number
  public averageTimeLockedInSeconds!: number
  public longestCompletedLockInSeconds!: number
  public totalNoOfCompletedLocks!: number
  public averageRating!: number
  public noOfRatings!: number
  public discordID!: string

  constructor(init?: Partial<LockeeCached>) {
    Object.assign(this, init || {})
  }
}
