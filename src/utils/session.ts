import { KieraCachedSession } from '@/objects/session'

/**
 * Fetch Session from LocalStorage cache
 * @export
 * @returns
 */
export function getSessionHeaders() {
  const fromStorage = localStorage.getItem('kiera-session')

  // No Session
  if (!fromStorage) {
    return new KieraCachedSession({})
  }

  return new KieraCachedSession(JSON.parse(fromStorage))
}

/**
 * Set Session in LocalStorage cache
 * @export
 * @param {string} username
 * @param {string} session
 */
export function setSessionHeaders(username: string, userID: string, session: string) {
  localStorage.setItem(
    'kiera-session',
    JSON.stringify({
      username,
      userID,
      session
    })
  )
}

export function delSession() {
  localStorage.removeItem('kiera-session')
}
