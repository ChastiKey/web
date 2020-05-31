const Dev = {
  Kiera: {
    Auth: 'http://localhost:8234/api/otl',
    Keyholder: 'http://localhost:8234/api/ck/keyholder',
    Lockee: 'http://localhost:8234/api/ck/lockee',
    Search: 'http://localhost:8234/api/ck/search',
    StatsLocks: 'http://localhost:8234/api/ck/stats/locks',
    VerifySession: 'http://localhost:8234/api/session/verify',
    User: 'http://localhost:8234/api/ck/user',
    DecisionManager: 'http://localhost:8234/api/decisions',
    DecisionManagerEditor: 'http://localhost:8234/api/decision',
    DecisionManagerUpdateProps: 'http://localhost:8234/api/decision/props',
    DecisionManagerUpdateConsumeReset: 'http://localhost:8234/api/decision/consumeReset',
    DecisionManagerNewOutcome: 'http://localhost:8234/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'http://localhost:8234/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'http://localhost:8234/api/decision/outcome',
    DecisionManagerNew: 'http://localhost:8234/api/decision',
    DecisionManagerDelete: 'http://localhost:8234/api/decision',
    DecisionManagerResetConsumed: 'http://localhost:8234/api/decision/consumedReset'
  }
}

const Prod = {
  Kiera: {
    Auth: 'https://kierabot.xyz/api/otl',
    Keyholder: 'https://kierabot.xyz/api/ck/keyholder',
    Lockee: 'https://kierabot.xyz/api/ck/lockee',
    Search: 'https://kierabot.xyz/api/ck/search',
    StatsLocks: 'https://kierabot.xyz/api/ck/stats/locks',
    VerifySession: 'https://kierabot.xyz/api/session/verify',
    User: 'https://kierabot.xyz/api/ck/user',
    DecisionManager: 'https://kierabot.xyz/api/decisions',
    DecisionManagerEditor: 'https://kierabot.xyz/api/decision',
    DecisionManagerUpdateProps: 'https://kierabot.xyz/api/decision/props',
    DecisionManagerUpdateConsumeReset: 'https://kierabot.xyz/api/decision/consumeReset',
    DecisionManagerNewOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'https://kierabot.xyz/api/decision/outcome',
    DecisionManagerNew: 'https://kierabot.xyz/api/decision',
    DecisionManagerDelete: 'https://kierabot.xyz/api/decision',
    DecisionManagerResetConsumed: 'https://kierabot.xyz/api/decision/consumedReset'
  }
}

export const API = process.env.NODE_ENV === 'development' ? Dev : Prod
