import Axios from 'axios'
import { API } from '@/api/endpoints'

export namespace StatsAPI {
  export async function fetchLocksStats() {
    const resp = await Axios(API.Kiera.StatsLocks, {
      method: 'GET'
    })

    return resp.data
  }
}
