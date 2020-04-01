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
  // Edit Name
  decisionRenameIsLoading: false,
  // Edit Description
  decisionDescriptionIsLoading: false,
  // Delete
  decisionDeletePrompt: false,
  decisionDeleteIsLoading: false,
  decisionDeleteId: '',
  // Edit Enabled
  decisionEnabledIsLoading: false,
  // New Outcome
  decisionNewOutcomePrompt: false,
  decisionNewOutcomeIsLoading: false,
  decisionNewOutcomeType: 'string' as 'string' | 'image' | 'url' | 'markdown',
  decisionNewOutcomeId: '',
  decisionNewOutcomeInput: '',
  // Consume Mode changes
  decisionConsumeModeIsLoading: false
}
