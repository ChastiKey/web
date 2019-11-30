import Axios from 'axios'
import { ChastiKey } from 'chastikey.js'
import { ListLocksLock } from 'chastikey.js/app/objects'
import { Kiera } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { LockeeCached } from '@/objects/lockee'
import { RunningLockCached } from '@/objects/lock'
import { ChastiKeyUser } from '@/objects/user'

export async function fetchRunningLocks() {
  try {
    const resp = await Axios(Kiera.Lockee, {
      method: 'GET',
      headers: getSessionHeaders()
    })

    return {
      user: new ChastiKeyUser(resp.data.user),
      lockee: new LockeeCached(resp.data.lockee),
      locks: resp.data.locks.map((l: RunningLockCached) => new RunningLockCached(l))
    }
  } catch (error) {
    return null
  }
}

export async function fetchRunningLocksLive(username: string) {
  try {
    const locksDeleted = await new ChastiKey().ListLocks.get({ username, showdeleted: true })
    const locksNotDeleted = await new ChastiKey().ListLocks.get({ username, showdeleted: false })
    const merged = [...locksDeleted.locks, ...locksNotDeleted.locks]
    console.table(merged, ['lockID', 'lockDeleted', 'timestampLocked', 'status'])
    return merged
  } catch (error) {
    console.error('ChastiKey.js error =>', error)
    return [] as Array<ListLocksLock>
  }
}
