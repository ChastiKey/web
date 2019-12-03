export class Decision {
  public readonly _id: string
  public name: string = ''
  public options: Array<DecisionOption> = []
  /**
   * Discord Snowflake
   * @type {string}
   * @memberof Decision
   */
  public authorID: string
  /**
   * Discord Server ID
   * @type {ObjectID}
   * @memberof Decision
   */
  public serverID: string
  /**
   * Limit the Decision roller to its serverID
   * @type {boolean}
   * @memberof Decision
   */
  public serverLimited: boolean = false
  /**
   * Enables or Disables the whole decision
   * @type {boolean}
   * @memberof Decision
   */
  public enabled: boolean = true
  /**
   * Number of times used
   * @type {number}
   * @memberof Decision
   */
  public counter: number = 0

  constructor(init?: Partial<Decision>) {
    Object.assign(this, init || {})
    this.options = this.options.map(o => new DecisionOption(o))
  }
}

export class DecisionOption {
  public readonly _id: string
  /**
   * Random decision outcome
   * @type {string}
   * @memberof DecisionOption
   */
  public text: string
  /**
   * Enables or Disables this decision outcome
   * @type {boolean}
   * @memberof DecisionOption
   */
  public enabled: boolean = true
  /**
   * The type and how to format it when displaying
   * @type {('string' | 'image' | 'url')}
   * @memberof DecisionOption
   */
  public type: 'string' | 'image' | 'url'

  constructor(init?: Partial<DecisionOption>) {
    Object.assign(this, init || {})
  }
}
