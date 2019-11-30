import { LockeeCached } from '@/objects/lockee'
import { RunningLockCached } from '@/objects/lock'
import { ChastiKeyUser } from '../objects/user'
import { ListLocksLock } from 'chastikey.js/app/objects'

export const $LockeeView = {
  user: new ChastiKeyUser(),
  lockee: new LockeeCached(),
  locks: [] as Array<RunningLockCached>,
  pastLocks: [] as Array<ListLocksLock>,
  sparklineData: [] as Array<number>,
  sparklineAutoDraw: false
}
