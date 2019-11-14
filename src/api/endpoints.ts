export namespace Kiera {
  /**
   * **Test Auth Status**
   *
   * Update Frequency: `Upon request`
   *
   * Request Type: `POST`
   */
  export const AuthDEV: string = 'https://dev.tdm.io:8234/api/ck/auth'
  export const Auth: string = 'https://kierabot.xyz/api/ck/auth'

  /**
   * **Fetches Keyholder View Data**
   *
   * Update Frequency: `Upon request/Cached Data (15 Mins)`
   *
   * Request Type: `GET`
   */
  export const KeyholderDEV: string = 'https://dev.tdm.io:8234/api/ck/keyholder'
  export const Keyholder: string = 'https://kierabot.xyz/api/ck/keyholder'

  /**
   * **Fetches Lockee View Data**
   *
   * Update Frequency: `Upon request/Cached Data (15 Mins)`
   *
   * Request Type: `GET`
   */
  export const LockeeDEV: string = 'https://dev.tdm.io:8234/api/ck/lockee'
  export const Lockee: string = 'https://kierabot.xyz/api/ck/lockee'
}
