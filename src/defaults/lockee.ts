import { LockeeData, LockeeDataLock } from 'chastikey.js/app/objects'

export const $LockeeView = {
  lockee: new LockeeData(),
  runningLocks: [] as Array<LockeeDataLock>,
  allLocks: [] as Array<LockeeDataLock>,
  sparklineData: [] as Array<number>,
  sparklineAutoDraw: false
}
