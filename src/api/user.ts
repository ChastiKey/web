import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { UserData } from 'chastikey.js/app/objects'

export namespace UserAPI {
  export async function fetchUser(username?: string) {
    try {
      const resp = await Axios(API.Kiera.User, {
        method: 'POST',
        headers: getSessionHeaders(),
        data: { username }
      })

      if (resp.data.success) {
        return {
          user: new UserData(resp.data.success ? resp.data.user : {}),
          discord: resp.data.discord
        }
      }
      // Fallback, request failure but with a response
      return {}
    } catch (error) {
      return null
    }
  }
}
