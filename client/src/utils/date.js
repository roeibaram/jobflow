const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

function createSafeDate(dateString) {
  if (!dateString) {
    return null
  }

  const normalizedDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`
  const date = new Date(normalizedDateString)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export function getDatePart(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.slice(0, 10)
}

export function formatDisplayDate(dateString) {
  const date = createSafeDate(dateString)

  if (!date) {
    return 'Not set'
  }

  return dateFormatter.format(date)
}

export function getTodayDate() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - timezoneOffset).toISOString().split('T')[0]
}

export function getDaysUntil(dateString) {
  const targetDate = createSafeDate(dateString)

  if (!targetDate) {
    return null
  }

  const today = createSafeDate(getTodayDate())
  const differenceInMs = targetDate.getTime() - today.getTime()

  return Math.round(differenceInMs / (1000 * 60 * 60 * 24))
}

export function getDaysSince(dateString) {
  const daysUntil = getDaysUntil(dateString)

  if (daysUntil === null) {
    return null
  }

  return daysUntil * -1
}
