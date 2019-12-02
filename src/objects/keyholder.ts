/**
 * ChastiKey Keyholder Statistcs
 * @export
 * @class ChastiKeyKeyholder
 */
export class ChastiKeyKeyholder {
  /**
   * ChastiKey user unique ID
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public userID: number
  /**
   * ChastiKey Username
   * @type {string}
   * @memberof ChastiKeyKeyholder
   */
  public username: string
  /**
   * Discord Showflake
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public discordID: string
  /**
   * Date Joined ChastiKey App
   * @type {string}
   * @memberof ChastiKeyKeyholder
   */
  public joined: string
  /**
   * # of locks created (not active, non-deleted)
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public noOfSharedLocks: number = 0
  /**
   * # of active Locks (Running now)
   *
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public noOfLocksManagingNow: number = 0
  /**
   * # of lockee's who have flagged KH as trusted
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public noOfLocksFlaggedAsTrusted: number = 0
  /**
   * # of locks loaded and used (inc current)
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public totalLocksManaged: number = 0
  /**
   * Average KH Rating provided by ChastiKey
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public averageRating: number
  /**
   * Number of Ratings from ChastiKey
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public noOfRatings: number
  /**
   * If KH want's their stats displayed
   * @type {number}
   * @memberof ChastiKeyKeyholder
   */
  public displayInStats: number
  /**
   * Date User began keyholding
   * @type {string}
   * @memberof ChastiKeyKeyholder
   */
  public dateFirstKeyheld: string

  constructor(init: Partial<ChastiKeyKeyholder>) {
    Object.assign(this, init)
  }

  /**
   * Compares what's in Kiera's DB for known Discord ID's and compares against what ChastiKey knows as verified
   * @param {number} knownID
   * @returns
   * @memberof ChastiKeyKeyholder
   */
  public isVerified() {
    return this.discordID !== null
  }
}
