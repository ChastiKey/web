import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'

export namespace KeyholderAPI {
  export async function fetchRunningLocks() {
    const resp = await Axios(API.Kiera.Keyholder, {
      method: 'GET',
      headers: getSessionHeaders()
    })

    return resp.data
  }
}
