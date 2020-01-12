import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'

export namespace StatsAPI {
  export async function fetchLocksStats(dateTime?: string) {
    const resp = await Axios(API.Kiera.StatsLocks, {
      headers: getSessionHeaders(),
      method: 'POST',
      data: { dateTime }
    })

    return resp.data
  }
}
