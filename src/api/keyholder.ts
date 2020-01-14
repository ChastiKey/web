import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { RunningLocksLock, KeyholderData, KeyholderDataLock } from 'chastikey.js/app/objects'

export namespace KeyholderAPI {
  export async function fetchRunningLocks() {
    const resp = await Axios(API.Kiera.Keyholder, {
      method: 'POST',
      headers: getSessionHeaders()
    })

    return {
      keyholder: resp.data.keyholder as KeyholderData,
      locks: (resp.data.locks as Array<KeyholderDataLock>).map(l => new KeyholderDataLock(l)),
      runningLocks: (resp.data.runningLocks as Array<RunningLocksLock>).map(l => new RunningLocksLock(l))
    }
  }
}
