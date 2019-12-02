import { KeyholderLock, RunningLockCached } from '@/objects/lock'
import { ChastiKeyKeyholder } from '@/objects/keyholder'

export const $KeyholderView = {
  keyholder: new ChastiKeyKeyholder({}),
  locks: [] as Array<KeyholderLock>,
  runningLocks: [] as Array<RunningLockCached>
}
