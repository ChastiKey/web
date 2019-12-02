import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'

export async function auth(sessionOverride?: string) {
  try {
    const cachedSession = getSessionHeaders()
    const resp = await Axios(API.Kiera.Auth, {
      method: 'POST',
      headers: { session: sessionOverride || cachedSession.session }
    })

    return {
      username: resp.data.username,
      session: sessionOverride || cachedSession.session,
      success: true
    }
  } catch (error) {
    return null
  }
}
