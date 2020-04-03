import { Decision } from '@/objects/decision'

export const $DecisionRollsView = {
  decisions: [] as Array<Decision>,
  // New Decision
  decisionNewPrompt: false,
  decisionNewIsLoading: false,
  decisionNewIdReceived: false,
  decisionNewId: '',
  decisionNewInput: ''
}

export const $DecisionRollEditor = {
  decision: new Decision(),
  // Edit Props
  decisionUpdatingPropsIsLoading: false,
  // Delete
  decisionDeletePrompt: false,
  decisionDeleteIsLoading: false,
  decisionDeleteId: '',
  // New Outcome
  decisionNewOutcomePrompt: false,
  decisionNewOutcomeIsLoading: false,
  decisionNewOutcomeType: 'string' as 'string' | 'image' | 'url' | 'markdown',
  decisionNewOutcomeId: '',
  decisionNewOutcomeInput: '',
  // Consume Mode changes
  decisionConsumeModeIsLoading: false
}
