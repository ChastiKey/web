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
    Auth: 'https://bot.kierabot.xyz/api/otl',
    Keyholder: 'https://bot.kierabot.xyz/api/ck/keyholder',
    Lockee: 'https://bot.kierabot.xyz/api/ck/lockee',
    Search: 'https://bot.kierabot.xyz/api/ck/search',
    StatsLocks: 'https://bot.kierabot.xyz/api/ck/stats/locks',
    VerifySession: 'https://bot.kierabot.xyz/api/session/verify',
    User: 'https://bot.kierabot.xyz/api/ck/user',
    DecisionManager: 'https://bot.kierabot.xyz/api/decisions',
    DecisionManagerUpdateName: 'https://bot.kierabot.xyz/api/decision/name',
    DecisionManagerUpdateEnabled: 'https://bot.kierabot.xyz/api/decision/enabled',
    DecisionManagerNewOutcome: 'https://bot.kierabot.xyz/api/decision/outcome',
    DecisionManagerDeleteOutcome: 'https://bot.kierabot.xyz/api/decision/outcome',
    DecisionManagerUpdateOutcome: 'https://bot.kierabot.xyz/api/decision/outcome',
    DecisionManagerNew: 'https://bot.kierabot.xyz/api/decision',
    DecisionManagerDelete: 'https://bot.kierabot.xyz/api/decision'
  }
}

export const API = process.env.NODE_ENV === 'development' ? Dev : Prod
