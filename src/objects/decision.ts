export class Decision {
  public readonly _id: string
  public name: string = ''

  /**
   * Description of roll
   * @type {string}
   * @memberof TrackedDecision
   */
  public description: string = ''

  /**
   * Possible outcomes
   * @type {Array<DecisionOption>}
   * @memberof TrackedDecision
   */
  public options: Array<DecisionOption> = []

  /**
   * Discord Snowflake
   * @type {string}
   * @memberof TrackedDecision
   */
  public authorID: string

  /**
   * Discord Server ID
   * @type {ObjectID}
   * @memberof TrackedDecision
   */
  public serverID: string

  /**
   * Permissions mode
   * @type {('All' | 'None' | 'Whitelist')}
   * @memberof TrackedDecision
   */
  public usagePermission: 'All' | 'None' | 'Whitelist' = 'All'

  /**
   * Enables or Disables the whole decision
   * @type {boolean}
   * @memberof TrackedDecision
   */
  public enabled: boolean = true

  /**
   * Number of times used
   * @type {number}
   * @memberof Decision
   */
  public counter: number = 0

  public serverWhitelist: Array<string> = []
  public userWhitelist: Array<string> = []
  public userBlacklist: Array<string> = []

  public log?: Array<DecisionLogEntry>

  public consumeMode: 'Basic' | 'Temporarily Consume' | 'Consume' = 'Basic'
  public consumeReset: number = 0 // Seconds

  // * Used on Kiera + CK web portal only * //
  public _isDescriptionChanged = false
  public _originalDescription = ''
  public _originalName = ''
  public _originalConsumeReset = 0

  constructor(init?: Partial<Decision>) {
    Object.assign(this, init || {})
    this.options = this.options.map(o => new DecisionOption(o))
    // Assign _originalDescription
    this._originalDescription = this.description
    this._originalName = this.name
    this._originalConsumeReset = this.consumeReset
  }
}

export class DecisionOption {
  public readonly _id: string

  /**
   * Random decision outcome
   * @type {string}
   * @memberof TrackedDecisionOption
   */
  public text: string

  /**
   * Enables or Disables this decision outcome
   * @type {boolean}
   * @memberof TrackedDecisionOption
   */
  public enabled: boolean = true

  /**
   * The type and how to format it when displaying
   * @type {('string' | 'image' | 'url' | 'markdown')}
   * @memberof TrackedDecisionOption
   */
  public type: 'string' | 'image' | 'url' | 'markdown'

  // * Used on Kiera + CK web portal only * //
  public _isChanged = false
  public _originalText = ''
  public _originalType = ''

  constructor(init?: Partial<DecisionOption>) {
    Object.assign(this, init || {})
    // Assign _originalText
    this._originalText = init.text
    this._originalType = init.type || 'string'
  }
}

export class DecisionLogEntry {
  public _id: string
  public callerID: string
  public decisionID: string
  public outcomeID: string
  public serverID?: string
  public channelID: string

  constructor(init?: Partial<DecisionLogEntry>) {
    Object.assign(this, init || {})
  }
}
