import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'

export async function validateAuth(userIDOverride?: string, sessionOveride?: string) {
  try {
    const cachedSession = getSessionHeaders()
    await Axios(API.Kiera.VerifySession, {
      method: 'POST',
      headers: { userID: userIDOverride || cachedSession.userID, session: sessionOveride || cachedSession.session }
    })

    return {
      session: sessionOveride || cachedSession.session,
      success: true
    }
  } catch (error) {
    return null
  }
}

export async function otl(otl: string) {
  try {
    const resp = await Axios(API.Kiera.Auth, {
      method: 'POST',
      data: { otl }
    })

    return {
      username: resp.data.chastikey.username,
      userID: resp.data.userID,
      session: resp.data.session,
      success: true
    }
  } catch (error) {
    return null
  }
}
