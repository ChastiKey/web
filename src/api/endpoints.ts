const Dev = {
  Kiera: {
    Auth: 'https://dev.tdm.io:8234/api/web/auth',
    Keyholder: 'https://dev.tdm.io:8234/api/web/keyholder',
    Lockee: 'https://dev.tdm.io:8234/api/web/lockee',
    StatsLocks: 'https://dev.tdm.io:8234/api/web/stats/locks',
    DecisionManager: 'https://dev.tdm.io:8234/api/web/decisions'
  }
}

const Prod = {
  Kiera: {
    /**
     * **Test Auth Status**
     *
     * Update Frequency: `Upon request`
     *
     * Request Type: `POST`
     */
    Auth: 'https://kierabot.xyz/api/ck/auth',

    /**
     * **Fetches Keyholder View Data**
     *
     * Update Frequency: `Upon request/Cached Data (15 Mins)`
     *
     * Request Type: `GET`
     */
    Keyholder: 'https://kierabot.xyz/api/ck/keyholder',

    /**
     * **Fetches Lockee View Data**
     *
     * Update Frequency: `Upon request/Cached Data (15 Mins)`
     *
     * Request Type: `GET`
     */
    Lockee: 'https://kierabot.xyz/api/ck/lockee',
    StatsLocks: 'https://kierabot.xyz/api/ck/stats/locks',
    DecisionManager: 'https://kierabot.xyz/api/web/decisions'
  }
}

export const API = process.env.NODE_ENV === 'development' ? Dev : Prod
