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
  if (monthsToDate < 1) return `${seconds / 60 / 60 / 24} mo.`
}
