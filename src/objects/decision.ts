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
   * Limit the Decision roller to its serverID
   * @type {boolean}
   * @memberof TrackedDecision
   */
  public serverLimited: boolean = false

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

  // * Used on Kiera + CK web portal only * //
  public _isDescriptionChanged = false
  public _originalDescription = ''

  constructor(init?: Partial<Decision>) {
    Object.assign(this, init || {})
    this.options = this.options.map(o => new DecisionOption(o))
    // Assign _originalDescription
    this._originalDescription = this.description
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
