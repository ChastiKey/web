import { Decision } from '@/objects/decision'

export const $DecisionManagerView = {
  decisions: [] as Array<Decision>,
  // Edit Name
  decisionRenamePrompt: false,
  decisionRenameIsLoading: false,
  decisionRenamePlaceholder: '',
  decisionRenameId: '',
  decisionRenameInput: '',
  // Delete
  decisionDeletePrompt: false,
  decisionDeleteIsLoading: false,
  decisionDeleteId: '',
  // Edit Enabled
  decisionEnabledIsLoading: false,
  // New Outcome
  decisionNewOutcomePrompt: false,
  decisionNewOutcomeIsLoading: false,
  decisionNewOutcomeType: 'string' as 'string' | 'image' | 'url',
  decisionNewOutcomeId: '',
  decisionNewOutcomeInput: '',
  // New Decision
  decisionNewPrompt: false,
  decisionNewIsLoading: false,
  decisionNewIdReceived: false,
  decisionNewId: '',
  decisionNewInput: ''
}
