import { KeyholderData, RunningLocksLock, KeyholderDataLock } from 'chastikey.js/app/objects'

export const $KeyholderView = {
  keyholder: new KeyholderData(),
  locks: [] as Array<KeyholderDataLock>,
  runningLocks: [] as Array<RunningLocksLock>,
  focusedSharedLock: {} as KeyholderDataLock
}
