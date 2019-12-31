import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { LockeeData, LockeeDataLock } from 'chastikey.js/app/objects'

export namespace LockeeAPI {
  export async function fetchRunningLocks() {
    try {
      const resp = await Axios(API.Kiera.Lockee, {
        method: 'GET',
        headers: getSessionHeaders()
      })

      return {
        lockee: new LockeeData(resp.data.lockee),
        runningLocks: resp.data.runningLocks.map((l: LockeeDataLock) => new LockeeDataLock(l)),
        allLocks: resp.data.allLocks.map((l: LockeeDataLock) => new LockeeDataLock(l))
      }
    } catch (error) {
      return null
    }
  }
}
