export function calculateHumanTimeDDHHMM(seconds: number) {
  // Calculate human readible time for lock from seconds
  const timelocked = seconds
  var min = Math.floor(timelocked / 60)
  var hrs = Math.floor(min / 60)
  min = min % 60
  var days = Math.floor(hrs / 24)
  hrs = hrs % 24

  const timeToShowDays = `${days > 9 ? +days : '0' + days}d`
  const timeToShowHours = `${hrs > 9 ? +hrs : '0' + hrs}h`
  const timeToShowMins = `${min > 9 ? +min : '0' + min}m`

  return `${timeToShowDays} ${timeToShowHours} ${timeToShowMins}`
}

export function calculateHumanTimeYearsMonthsDays(seconds: number) {
  const monthsToDate = Math.round((seconds / 2592000) * 100) / 100

  // If its years
  if (monthsToDate >= 12) return `${Math.round((monthsToDate / 12) * 100) / 100} yr.`
  // Months
  if (monthsToDate < 12 && monthsToDate > 1) return `${monthsToDate} mo.`
  // Days
  if (seconds >= 86400 && seconds < 86400 * 30) return `${Math.round((seconds / 60 / 60 / 24) * 100) / 100} days`
}

export function calculateHumanTimeYearsMonthsDaysHours(seconds: number) {
  const monthsToDate = Math.round((seconds / 2592000) * 100) / 100

  // If its years
  if (monthsToDate >= 12) return `${Math.round((monthsToDate / 12) * 100) / 100} yr.`
  // Months
  if (seconds >= 86400 * 30) return `${monthsToDate} mo.`
  // Days
  if (seconds >= 86400 && seconds < 86400 * 30) return `${Math.round((seconds / 60 / 60 / 24) * 100) / 100} days`
  // Hours
  if (seconds < 86400) return `${Math.round((seconds / 60 / 60) * 100) / 100} hrs`
}

export function calculateHumanTimeYearsMonthsDaysHoursFromMins(mins: number) {
  const monthsToDate = Math.round((mins / 43800) * 100) / 100

  // If its years
  if (monthsToDate >= 12) return `${Math.round((monthsToDate / 12) * 100) / 100} yr.`
  // Months
  if (mins >= 43800) return `${monthsToDate} mo.`
  // Days
  if (mins >= 1440 && mins < 43800) return `${Math.round((mins / 60 / 24) * 100) / 100} day(s)`
  // Hours
  if (mins < 1440) return `${Math.round((mins / 60) * 100) / 100} hr(s)`
}

export function formatFrequency(frequency: number) {
  if (frequency < 1) return `${frequency * 60}mins`
  if (frequency === 1) return `${1}hr`
  if (frequency > 1) return `${frequency}hrs`
}
