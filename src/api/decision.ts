import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { Decision } from '@/objects/decision'

export namespace DecisionAPI {
  export async function fetchMyDecisions() {
    const resp = await Axios(API.Kiera.DecisionManager, {
      method: 'GET',
      headers: getSessionHeaders()
    })

    return resp.data as Array<Decision>
  }
}
