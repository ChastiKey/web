const Dev = {
  Kiera: {
    Auth: 'https://dev.tdm.io:8234/api/ck/auth',
    Keyholder: 'https://dev.tdm.io:8234/api/ck/keyholder',
    Lockee: 'https://dev.tdm.io:8234/api/ck/lockee',
    StatsLocks: 'https://dev.tdm.io:8234/api/ck/stats/locks',
    DecisionManager: 'https://dev.tdm.io:8234/api/decisions',
    DecisionManagerUpdateName: 'https://dev.tdm.io:8234/api/decision/name',
    DecisionManagerUpdateEnabled: 'https://dev.tdm.io:8234/api/decision/enabled',
    DecisionManagerNewOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerNew: 'https://dev.tdm.io:8234/api/decision',
    DecisionManagerDelete: 'https://dev.tdm.io:8234/api/decision'
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
    DecisionManager: 'https://kierabot.xyz/api/decisions',
    DecisionManagerUpdateName: 'https://kierabot.xyz/api/decision/name',
    DecisionManagerUpdateEnabled: 'https://kierabot.xyz/api/decision/enabled',
    DecisionManagerNewOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerNew: 'https://kierabot.xyz/api/decision',
    DecisionManagerDelete: 'https://kierabot.xyz/api/decision'
  }
}

export const API = process.env.NODE_ENV === 'development' ? Dev : Prod
