export class KeyholderLock {
  public avgLockedTime!: number
  public count!: number
  public name!: string
  public running!: Array<RunningLockCached>
  public uniqueCount!: number

  constructor(init: Partial<KeyholderLock>) {
    Object.assign(this, init || {})
    this.running.map(l => new RunningLockCached(l))
  }
}

export class PastLock {
  constructor(init: Partial<PastLock>) {
    Object.assign(this, init || {})
  }
}

export class RunningLockCached {
  // Kiera props
  public readonly _id!: string
  // ChastiKey Props
  /**
   * ChastiKey user unique ID
   * @type {number}
   * @memberof TrackedChastiKeyKeyholderStatistics
   */
  public userID!: number
  /**
   * ChastiKey Username
   * @type {string}
   * @memberof TrackedChastiKeyKeyholderStatistics
   */
  public username!: string
  /**
   * Discord Showflake
   * @type {number}
   * @memberof TrackedChastiKeyKeyholderStatistics
   */
  public discordID!: string
  /**
   * Date Joined ChastiKey App
   * @type {string}
   * @memberof TrackedChastiKeyKeyholderStatistics
   */
  public sharedLockID!: string
  public regularity!: number
  public multipleGreensRequired!: number
  public timestampLocked!: number
  public secondsLocked!: number
  public fixed!: number
  public cumulative!: number
  public cardInfoHidden!: number
  public timerHidden!: number
  public noOfTurns!: number
  public lockFrozenByCard!: number
  public lockFrozenByKeyholder!: number
  public discardPile!: string | Array<string>
  public lockedBy!: string
  public displayInStats!: number
  public sharedLockName!: string
  /// Cards ///
  public doubleUpCards!: number
  public freezeCards!: number
  public greenCards!: number
  public redCards!: number
  public resetCards!: number
  public stickyCards!: number
  public yellowCards!: number

  constructor(init?: Partial<RunningLockCached>) {
    Object.assign(this, init || {})
    // Parse Discard Pile
    if (this.discardPile) {
      this.discardPile = String(this.discardPile)
        .split(',')
        .filter(c => !!c)
    }
  }
}
