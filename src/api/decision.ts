import Axios, { AxiosResponse } from 'axios'
import { API } from '@/api/endpoints'
import { getSessionHeaders } from '@/utils/session'
import { Decision, DecisionOption } from '@/objects/decision'

export namespace DecisionAPI {
  export async function fetchMyDecisions() {
    try {
      const resp = await Axios(API.Kiera.DecisionManager, {
        method: 'GET',
        headers: getSessionHeaders()
      })

      return resp.data as Array<Decision>
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return []
    }
  }

  export async function updateDecisionName(_id: string, name: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerUpdateName, {
        method: 'PATCH',
        headers: getSessionHeaders(),
        data: { _id, name }
      })) as AxiosResponse<{ status: string; success: boolean }>

      return resp.data.success
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return false
    }
  }

  export async function updateDecisionEnabled(_id: string, enabled: boolean) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerUpdateEnabled, {
        method: 'PATCH',
        headers: getSessionHeaders(),
        data: { _id, enabled }
      })) as AxiosResponse<{ status: string; success: boolean }>

      return resp.data.success
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return false
    }
  }

  export async function decisionNewOutcome(_id: string, type: 'string' | 'image' | 'url', text: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerNewOutcome, {
        method: 'PUT',
        headers: getSessionHeaders(),
        data: { _id, type, text }
      })) as AxiosResponse<{ status: string; success: boolean; data: DecisionOption }>

      return resp.data.success ? new DecisionOption(resp.data.data) : null
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return null
    }
  }

  export async function decisionDeleteOutcome(_id: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerNewOutcome, {
        method: 'DELETE',
        headers: getSessionHeaders(),
        data: { _id }
      })) as AxiosResponse<{ status: string; success: boolean }>

      return resp.data.success
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return null
    }
  }

  export async function decisionUpdateOutcome(_id: string, type: string, text: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerUpdateOutcome, {
        method: 'PATCH',
        headers: getSessionHeaders(),
        data: { _id, type, text }
      })) as AxiosResponse<{ status: string; success: boolean }>

      return resp.data.success
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return null
    }
  }

  export async function decisionNew(name: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerNew, {
        method: 'PUT',
        headers: getSessionHeaders(),
        data: { name }
      })) as AxiosResponse<{ status: string; success: boolean; _id: string }>

      return resp.data
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return null
    }
  }

  export async function decisionDelete(_id: string) {
    try {
      const resp = (await Axios(API.Kiera.DecisionManagerDelete, {
        method: 'DELETE',
        headers: getSessionHeaders(),
        data: { _id }
      })) as AxiosResponse<{ status: string; success: boolean }>

      return resp.data.success
    } catch (error) {
      console.error('DecisionAPI Error =>', error)
      return null
    }
  }
}
