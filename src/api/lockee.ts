import Axios from 'axios'
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
      locks: resp.data.locks.map(
        (l: RunningLockCached) => new RunningLockCached(l)
      )
    }
  } catch (error) {
    return {
      user: new ChastiKeyUser(),
      lockee: new LockeeCached(),
      locks: []
    }
  }
}
