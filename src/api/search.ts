import Axios from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'

export async function fetchAutoCompleteItems(query?: string) {
  try {
    const resp = await Axios(API.Kiera.Search, {
      method: 'POST',
      headers: getSessionHeaders(),
      data: { query }
    })

    return resp.data as Array<{ type: string; name: string }>
  } catch (error) {
    return [] as Array<{ type: string; name: string }>
  }
}
