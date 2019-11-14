import { LockeeCached } from '@/objects/lockee'
import { RunningLockCached } from '@/objects/lock'
import { ChastiKeyUser } from '../objects/user'

export const $LockeeView = {
  user: new ChastiKeyUser(),
  lockee: new LockeeCached(),
  locks: [] as Array<RunningLockCached>
}
