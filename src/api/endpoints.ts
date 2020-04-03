const Dev = {
  Kiera: {
    Auth: 'https://dev.tdm.io:8234/api/otl',
    Keyholder: 'https://dev.tdm.io:8234/api/ck/keyholder',
    Lockee: 'https://dev.tdm.io:8234/api/ck/lockee',
    Search: 'https://dev.tdm.io:8234/api/ck/search',
    StatsLocks: 'https://dev.tdm.io:8234/api/ck/stats/locks',
    VerifySession: 'https://dev.tdm.io:8234/api/session/verify',
    User: 'https://dev.tdm.io:8234/api/ck/user',
    DecisionManager: 'https://dev.tdm.io:8234/api/decisions',
    DecisionManagerEditor: 'https://dev.tdm.io:8234/api/decision',
    DecisionManagerUpdateProps: 'https://dev.tdm.io:8234/api/decision/props',
    DecisionManagerUpdateConsumeReset: 'https://dev.tdm.io:8234/api/decision/consumeReset',
    DecisionManagerNewOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'https://dev.tdm.io:8234/api/decision/outcome',
    DecisionManagerNew: 'https://dev.tdm.io:8234/api/decision',
    DecisionManagerDelete: 'https://dev.tdm.io:8234/api/decision',
    DecisionManagerResetConsumed: 'https://dev.tdm.io:8234/api/decision/consumedReset'
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
