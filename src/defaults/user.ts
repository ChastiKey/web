import { UserData, KeyholderDataLock, LockeeDataLock } from 'chastikey.js/app/objects'

export const $DefaultUser = {
  data: new UserData(),
  discord: { id: '', avatar: '' },
  sharedLocks: [] as Array<KeyholderDataLock>,
  runningLocks: [] as Array<LockeeDataLock>,
  focusedSharedLock: {} as KeyholderDataLock
}
